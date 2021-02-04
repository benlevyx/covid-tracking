from pathlib import Path
from datetime import date


root = Path(__file__).parent.parent.parent
data = root / 'data'
raw = data / 'raw'
processed = data / 'processed'
geodata = raw / 'geodata'
src = root / 'src'
notebooks = root / 'notebooks'
models = root / 'models'
figs = root / 'figs'

start_date = date(2020, 2, 1) # February 1, 2020
end_date = date(2021, 1, 31) # January 1, 2021


plotly_credentials_file = root / 'PLOTLY_CREDENTIALS.yaml'
