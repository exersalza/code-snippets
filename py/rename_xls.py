import os

from glob import glob
from sys import argv


def main():
    for i in glob(argv[1] + "**/*.xls*", recursive = True):


        *path, file = i.split('\\')

        if file.startswith("COPY"):


            continue

        os.rename(i, f"{'\\'.join(path)}\\COPY {file}")








if __name__ == "__main__":
    main()





