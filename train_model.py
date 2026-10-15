#!/usr/bin/env python3
"""
Entrenamiento de clasificador de tipo de piel (5 clases) usando Fitzpatrick17k
Exporta a formato TensorFlow.js (model.json + weights)

Ejecutar en Google Colab (GPU gratis) o local con GPU.
"""

import os
import json
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight

import tensorflow as tf
from tensorflow.keras import layers, models, optimizers, callbacks
from tensorflow.keras.applications import MobileNetV2
import tensorflowjs as tfjs

# CONFIGURACIÓN
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS_HEAD = 10
EPOCHS_FINE = 15
LR_HEAD = 1e-3
LR_FINE = 1e-5
DATA_DIR = Path("./fitzpatrick17k")
MODEL_DIR = Path("./tfjs_model")

# Mapeo Fitzpatrick (I-VI) → 5 clases cosméticas
# I-II: muy clara → sensible/seca
# III-IV: media → normal/mixta
# V-VI: oscura → grasa/mixta
FITZ_TO_SKIN = {
    1: "sensible",   # Tipo I
    2: "seca",       # Tipo II
    3: "normal",     # Tipo III
    4: "mixta",      # Tipo IV
    5: "grasa",      # Tipo V
    6: "grasa",      # Tipo VI
}
CLASS_NAMES = ["seca", "grasa", "mixta", "sensible", "normal"]
NUM_CLASSES = len(CLASS_NAMES)


def download_fitzpatrick17k(data_dir: Path):
    """Descarga Fitzpatrick17k desde GitHub (requiere ~2 GB)."""
    data_dir.mkdir(parents=True, exist_ok=True)
    
    csv_url = "https://raw.githubusercontent.com/mattgroh/fitzpatrick17k/main/fitzpatrick17k.csv"
    csv_path = data_dir / "fitzpatrick17k.csv"
    
    if not csv_path.exists():
        print("Descargando metadata CSV...")
        import urllib.request
        urllib.request.urlretrieve(csv_url, csv_path)
    
    df = pd.read_csv(csv_path)
    print(f"Total imágenes: {len(df)}")
    print(f"Distribución Fitzpatrick:\n{df['fitzpatrick'].value_counts().sort_index()}")
    
    # Filtrar solo las que tienen URL válida
    df = df.dropna(subset=['url', 'fitzpatrick'])
    df['fitzpatrick'] = df['fitzpatrick'].astype(int)
    df['skin_type'] = df['fitzpatrick'].map(FITZ_TO_SKIN)
    
    print(f"\nDistribución clases objetivo:\n{df['skin_type'].value_counts()}")
    
    # Descargar imágenes (sample para prueba, quitar .head(1000) para completo)
    print("\nDescargando imágenes (esto tarda... usa sample pequeño para test)...")
    # NOTA: En Colab real, descargarías todas. Aquí limitamos a 2000 para demo.
    df_sample = df.groupby('skin_type').apply(lambda x: x.sample(min(400, len(x)), random_state=42)).reset_index(drop=True)
    print(f"Usando {len(df_sample)} imágenes balanceadas")
    
    img_dir = data_dir / "images"
    img_dir.mkdir(exist_ok=True)
    
    for idx, row in df_sample.iterrows():
        img_path = img_dir / f"{idx}.jpg"
        if not img_path.exists():
            try:
                urllib.request.urlretrieve(row['url'], img_path)
            except Exception as e:
                print(f"Error descargando {row['url']}: {e}")
    
    return df_sample, img_dir


def create_tf_dataset(df, img_dir, training=True):
    """Crea tf.data.Dataset con augmentación."""
    paths = [str(img_dir / f"{idx}.jpg") for idx in df.index]
    labels = [CLASS_NAMES.index(l) for l in df['skin_type']]
    
    def load_image(path, label):
        img = tf.io.read_file(path)
        img = tf.image.decode_jpeg(img, channels=3)
        img = tf.image.resize(img, (IMG_SIZE, IMG_SIZE))
        img = tf.cast(img, tf.float32) / 255.0
        return img, label
    
    def augment(img, label):
        img = tf.image.random_flip_left_right(img)
        img = tf.image.random_brightness(img, 0.2)
        img = tf.image.random_contrast(img, 0.8, 1.2)
        img = tf.image.random_saturation(img, 0.8, 1.2)
        img = tf.image.random_hue(img, 0.1)
        img = tf.clip_by_value(img, 0, 1)
        return img, label
    
    ds = tf.data.Dataset.from_tensor_slices((paths, labels))
    ds = ds.map(load_image, num_parallel_calls=tf.data.AUTOTUNE)
    
    if training:
        ds = ds.map(augment, num_parallel_calls=tf.data.AUTOTUNE)
        ds = ds.shuffle(1000)
    
    ds = ds.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)
    return ds


def build_model():
    """MobileNetV2 + head personalizado."""
    base = MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights='imagenet'
    )
    base.trainable = False
    
    inputs = layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    x = base(inputs, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(128, activation='relu')(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(NUM_CLASSES, activation='softmax', name='predictions')(x)
    
    model = models.Model(inputs, outputs)
    return model, base


def train():
    print("=== DESCARGANDO DATOS ===")
    df, img_dir = download_fitzpatrick17k(DATA_DIR)
    
    # Split
    train_df, val_df = train_test_split(
        df, test_size=0.2, stratify=df['skin_type'], random_state=42
    )
    print(f"Train: {len(train_df)}, Val: {len(val_df)}")
    
    # Class weights
    y_train = [CLASS_NAMES.index(l) for l in train_df['skin_type']]
    class_weights = compute_class_weight('balanced', classes=np.unique(y_train), y=y_train)
    class_weight_dict = {i: w for i, w in enumerate(class_weights)}
    print(f"Class weights: {class_weight_dict}")
    
    train_ds = create_tf_dataset(train_df, img_dir, training=True)
    val_ds = create_tf_dataset(val_df, img_dir, training=False)
    
    print("\n=== CONSTRUYENDO MODELO ===")
    model, base = build_model()
    
    # Fase 1: Entrenar solo head
    print(f"\n=== FASE 1: Head only ({EPOCHS_HEAD} epochs) ===")
    model.compile(
        optimizer=optimizers.Adam(LR_HEAD),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy', tf.keras.metrics.TopKCategoricalAccuracy(k=2, name='top2_acc')]
    )
    
    history1 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS_HEAD,
        class_weight=class_weight_dict,
        callbacks=[
            callbacks.EarlyStopping(patience=3, restore_best_weights=True),
            callbacks.ReduceLROnPlateau(patience=2, factor=0.5)
        ]
    )
    
    # Fase 2: Fine-tuning últimas capas
    print(f"\n=== FASE 2: Fine-tuning ({EPOCHS_FINE} epochs) ===")
    base.trainable = True
    # Congelar capas tempranas
    for layer in base.layers[:-30]:
        layer.trainable = False
    
    model.compile(
        optimizer=optimizers.Adam(LR_FINE),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy', tf.keras.metrics.TopKCategoricalAccuracy(k=2, name='top2_acc')]
    )
    
    history2 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS_FINE,
        class_weight=class_weight_dict,
        callbacks=[
            callbacks.EarlyStopping(patience=4, restore_best_weights=True),
            callbacks.ReduceLROnPlateau(patience=2, factor=0.5)
        ]
    )
    
    # Evaluar
    print("\n=== EVALUACIÓN FINAL ===")
    results = model.evaluate(val_ds, return_dict=True)
    print(f"Test accuracy: {results['accuracy']:.4f}")
    print(f"Test top-2 acc: {results['top2_acc']:.4f}")
    
    # Exportar a TF.js
    print(f"\n=== EXPORTANDO A TF.JS en {MODEL_DIR} ===")
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    tfjs.converters.save_keras_model(model, str(MODEL_DIR))
    
    # Guardar metadata
    metadata = {
        "class_names": CLASS_NAMES,
        "img_size": IMG_SIZE,
        "fitz_mapping": FITZ_TO_SKIN,
        "model_type": "MobileNetV2 + custom head",
        "training_samples": int(len(train_df)),
        "val_accuracy": float(results['accuracy'])
    }
    with open(MODEL_DIR / "metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)
    
    print("¡Listo! Modelo exportado en:", MODEL_DIR)
    print("Sube la carpeta tfjs_model a tu servidor/web hosting.")
    
    return model, history1, history2


if __name__ == "__main__":
    # Verificar GPU
    print("GPUs disponibles:", tf.config.list_physical_devices('GPU'))
    train()