from time import time
from IPython.display import display
import pandas as pd
import numpy as np
import scipy.stats as spstats

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


def cramers_v_corrected(x1, x2):
    """From https://stackoverflow.com/questions/20892799/using-pandas-calculate-cram%C3%A9rs-coefficient-matrix

    TODO: Check this.
    """
    assert len(x1) == len(x2), f'Columns do not have equal length ({len(x1)}, {len(x2)})'
    confusion_matrix = pd.crosstab(x1, x2)
    correction = True if confusion_matrix.shape[0] == 2 else False
    chi2 = spstats.chi2_contingency(confusion_matrix, correction=correction)[0]
    n = len(x1)
    phi2 = chi2 / n
    r, k = confusion_matrix.shape
    phi2corr = max(0, phi2 - ((k - 1) * (r - 1)) / (n - 1))
    rcorr = r - ((r - 1) ** 2) / (n - 1)
    kcorr = k - ((k - 1) ** 2) / (n - 1)
    return np.sqrt(phi2corr / min((kcorr - 1), (rcorr - 1)))
