from time import time
from IPython.display import display
import pandas as pd

from . import config


def display_all_rows(df):
    with pd.option_context("display.max_rows", None):
        display(df)


def display_all_cols(df):
    with pd.option_context("display.max_columns", None):
        display(df)


def display_all(df):
    with pd.option_context("display.max_rows", None, "display.max_columns", None):
        display(df)


def time_func(f):
    def inner(*args, **kwargs):
        start = time.time()
        res = f(*args, **kwargs)
        end = time.time()
        print(f'Time elapsed: {(end - start)}')
        return res
    return inner