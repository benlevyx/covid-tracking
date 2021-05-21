import matplotlib.pyplot as plt


def remove_spines(ax, spines=['left', 'right', 'bottom', 'top']):
    for spine in spines:
        ax.spines[spine].set_visible(False)
