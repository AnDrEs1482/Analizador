# Modelo TensorFlow.js para LuaShop Analyzer

## Entrenamiento

1. Abre `train_model_colab.ipynb` en **Google Colab** (gratis con GPU)
2. Ejecuta todas las celdas en orden
3. Al final, descarga `tfjs_model.zip`
4. Extrae el contenido en esta carpeta (`tfjs_model/`)

## Estructura esperada

```
tfjs_model/
├── model.json          # Arquitectura + metadatos
├── group1-shard1of1.bin  # Pesos (puede haber varios shards)
└── metadata.json       # Info de clases, tamaño, etc.
```

## Clases del modelo (orden fijo)

```json
["seca", "grasa", "mixta", "sensible", "normal"]
```

## Mapeo Fitzpatrick usado en entrenamiento

| Fitzpatrick | Clase objetivo |
|-------------|----------------|
| I           | sensible       |
| II          | seca           |
| III         | normal         |
| IV          | mixta          |
| V           | grasa          |
| VI          | grasa          |

## Tamaño de entrada

- 224×224×3 (RGB, normalizado 0-1)
- Batch: 1

## Salida

- Softmax sobre 5 clases
- Suma = 1.0

## Si no tienes modelo entrenado

El analizador detectará automáticamente la ausencia del modelo y caerá en **modo demo** (análisis aleatorio con disclaimer visible).