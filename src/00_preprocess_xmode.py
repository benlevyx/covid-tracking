"""Preprocessing X-Mode Social Data

1. Connecting AWS and loading each asset separately
2. Subsetting to NYC only and adding to a single dataset
3. Saving to file
"""
from tqdm import tqdm
import pandas as pd
from shapely.geometry import Point, Polygon

from tracking import config, utils, aws, geo


def load_chunk(asset_id):
    pass


def nyc_poly():
    pass


def subset_xmode_to_nyc(df, nyc_poly):
    pass


@utils.time_func
def main():
    pass


if __name__ == '__main__':
    main()
