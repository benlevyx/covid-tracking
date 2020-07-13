from pathlib import Path


root = Path(__file__).parent.parent.parent
data = root / 'data'
raw = data / 'raw'
processed = data / 'processed'
geodata = raw / 'geodata'
src = root / 'src'
notebooks = root / 'notebooks'
models = root / 'models'
figs = root / 'figs'


xmode_cols = ['advertiser_id', 'platform', 'location_at', 'latitude', 'longitude',
              'altitude', 'horizontal_accuracy', 'vertical_accuracy', 'heading',
              'speed', 'ipv_4', 'ipv_6', 'final_country', 'user_agent', 'background',
              'publisher_id', 'wifi_ssid', 'wifi_bssid', 'tech_signals', 'carrier',
              'device_model', 'venue_name', 'venue_category', 'dwell_time']

plotly_credentials_file = root / 'PLOTLY_CREDENTIALS.yaml'
