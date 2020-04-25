"""Geographic utilities for working with location data.
"""
import numpy as np
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point, Polygon

from . import config


def load_nyc_gdf():
    """Load a polygon for New York City.
    """
    nyc_file = config.geodata / 'nyc.geojson'
    gdf = gpd.read_file(nyc_file)
    return gdf


def points_in_poly(gdf, poly):
    """Return a boolean series indicating which points in `gdf` are within
    shapely Polygon, `poly`.
    """
    return gdf.geometry.within(poly)
