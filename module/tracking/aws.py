from time import sleep

import boto3
import pandas as pd
import geopandas as gpd

from . import config

def get_xmode_signed_url():
    datax = boto3.client('dataexchange')

    print("Creating job")
    response = datax.create_job(
        Details={
            'ExportAssetToSignedUrl': {
                'AssetId': 'c5537697a7bba1bd25b0b2e214de5b77',
                'DataSetId': 'a93e415c05725c32b2a3000309dbc2c8',
                'RevisionId': 'd611234d782b89b853e7d76b178bffba'
            }
        },
        Type='EXPORT_ASSET_TO_SIGNED_URL'
    )
    job_id = response['Id']

    print("Starting job")
    response = datax.start_job(JobId=job_id)

    print("Getting job")
    for i in range(100):
        sleep(1)
        response = datax.get_job(JobId=job_id)
        if response['State'] == 'COMPLETED':
            break
    return response['Details']['ExportAssetToSignedUrl']['SignedUrl']


def load_xmode(geo=True, **kwargs):
    url = get_xmode_signed_url()
    print("Loading data")
    xmode = pd.read_csv(url,
                        compression='gzip',
                        error_bad_lines=False, **kwargs)
    if geo:
        xmode = gpd.GeoDataFrame(xmode,
                                 geometry=gpd.points_from_xy(xmode.longitude,
                                                             xmode.latitude))
    return xmode


def get_xmode_asset_ids(client=None,
                        dataset_id=config.xmode.dataset_id,
                        revision_id=config.xmode.revision_id):
    """List all assets for a given dataset and revision
    """
    if client is None:
        client = boto3.client('dataexchange')
    response = client.list_revision_assets(
        DataSetId=dataset_id,
        RevisionId=revision_id
    )
    asset_ids = [a['Id'] for a in response['Assets'] if 'Id' in a]
    return asset_ids
