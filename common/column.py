import math

def make_column(images):
    len_images = len(images)
    div = math.ceil(len_images/3)
    cols = {'col1': images[:div],
            'col2': images[div:2*div],
            'col3': images[2*div:]}
    return cols
