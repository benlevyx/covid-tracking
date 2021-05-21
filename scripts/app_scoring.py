import re
from datetime import date, timedelta, datetime
from textwrap import dedent

import pandas as pd
import numpy as np

from tracking import config, utils, plotting


question2col = {
    "1.1. App has defined lifetime": "11_defined_lifetime",
    "1.2. Data storage is time-limited": "12_storage_time_limited",
    "2.1. Opt-in download and use": "21_opt_in_download_use",
    "2.2. Opt-in data sharing": "22_opt_in_share",
    "2.3. Not tied to other benefits": "23_other_benefits",
    "3.1. Data used only for establishing contacts": "31_only_contacts",
    "3.2. No PII collection": "32_no_pii",
    "4.1. Open source": "41_open_source",
    "4.2. Published privacy policy": "42_privacy_policy",
    "5.1. Freely available": "51_free",
    "5.2. Android and iOS (when necessary)": "52_android_ios",
    "6.1. Decentralized storage": "61_decentralized_storage",
    "6.2. Can erase data": "62_erase_data",
    "7.1. Decentralized matching": "71_decentralized_matching",
    "7.2. Rotating randomized beacon": "72_rotating_randomized",
    "8.1. Contact accuracy (BLE, not GPS or other)": "81_ble_only",
    "8.2. Positive cases verified by test": "82_verify_test",
}

col2question = {c: q for q, c in question2col.items()}

replace_dct = {
    "na": "unknown",
    "no (WOM vouchers)": "no",
    "maybe": "unknown",
    "no (public spaces)": "no",
    "maybe (blockchain)": "unknown",
    "both": "yes",
    "android only": "yes",
    "iOS only": "no",
    "eBracelet": "no",
    "no (digital passport)": "no",
    "no (travel)": "no",
}

replace_vals = {"no": 0, "maybe": 0, "unknown": 0, "yes": 1}


def replace_days(x):
    if x == "no" or x == "unknown":
        return x
    else:
        return "yes"


def replace_data_use(x):
    if x == "na":
        return "unknown"
    elif x == "yes":
        return "yes"
    else:
        return "no"


def replace_contact_accuracy(x):
    if x == "ble":
        return "yes"
    elif "ble" in "x":
        return "unknown"
    elif x == "unknown":
        return "unknown"
    else:
        return "no"


def replace_test(x):
    if x == "na":
        return "unknown"
    elif x in ["yes", "unknown"]:
        return x
    else:
        return "no"


def get_us_state(row):
    row_copy = row.copy()
    if "United States (" in row_copy["Country"]:
        row_copy["state"] = re.findall(r"\(([A-Za-z, ]+)\)", row_copy["Country"])[0]
        row_copy["Country"] = "United States"
    else:
        row_copy["state"] = ""
    return row_copy


def code_data(data: pd.DataFrame) -> pd.DataFrame:
    df_coded = data.rename(columns=question2col)
    df_coded["has_protocol"] = df_coded["protocol"].apply(
        lambda x: "yes" if x != "none" else "no"
    )
    df_coded["12_storage_time_limited"] = df_coded["12_storage_time_limited"].apply(
        replace_days
    )
    df_coded["31_only_contacts"] = df_coded["31_only_contacts"].apply(replace_data_use)
    df_coded["81_ble_only"] = df_coded["81_ble_only"].apply(replace_contact_accuracy)
    df_coded["82_verify_test"] = df_coded["82_verify_test"].apply(replace_test)
    for col in question2col.values():
        df_coded[col] = df_coded[col].replace(replace_dct).replace(replace_vals)

    df_coded = df_coded.apply(get_us_state, axis=1)
    df_coded["date_released"] = pd.to_datetime(df_coded["date_released"])

    df_coded["protocol"] = df_coded["protocol"].replace(
        {np.nan: "none", "unknown": "none"}
    )
    other_protocols = [
        p
        for p in df_coded["protocol"].unique()
        if p not in ["none", "Apple/Google", "DP3T", "TCN"]
    ]
    df_coded["protocol_other"] = df_coded["protocol"].replace(other_protocols, "other")
    df_coded["protocol_other"] = df_coded["protocol_other"].replace(
        ["DP3T", "TCN"], "DP3T/TCN"
    )

    nan_replace_cols = [
        col for col in df_coded.columns if re.match(r"\d{2}_[a-z]+", col)
    ]
    for col in nan_replace_cols:
        df_coded[col] = df_coded[col].fillna(0)

    return df_coded


def score_app(row):
    colnames = row.index
    total_score = 0.0
    for i in range(1, 9):
        s = str(i)
        cols = [col for col in colnames if col.startswith(s)]
        max_col_score = len(cols)

        col_score = 0
        for j, col in enumerate(cols):
            col_score += row[col]
        col_score /= max_col_score
        total_score += col_score
    return total_score


def score_data(data):
    return data.assign(score=data.apply(score_app, axis=1)).drop_duplicates()


def main():
    df_apps = pd.read_csv(config.data / "apps.csv")
    df_coded = code_data(df_apps)
    df_scored = score_data(df_coded)
    df_scored.to_csv(config.data / "apps_scored.csv")


if __name__ == "__main__":
    main()
