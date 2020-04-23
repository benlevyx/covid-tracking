from pathlib import Path


root = Path(__file__).parent.parent.parent
data = root / 'data'
raw = data / 'raw'
processed = data / 'processed'
src = root / 'src'
notebooks = root / 'notebooks'
models = root / 'models'
