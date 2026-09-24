from os.path import exists, isdir
from pathlib import Path
import subprocess
import sys
import os
import glob

def main():
    args = sys.argv[1:]

    if len(args) > 1:
        print("Syntax: py clean.py [project]")
        return

    for path in glob.glob("./**/Cargo.toml", recursive=True):

        server = path.replace("Cargo.toml", "")
        print(f"Starting {server}")

        f = subprocess.run(f"cd {server} && cargo clean", shell=True)
        print(f"Finished {server}")



if __name__ == "__main__":
    exit(main())
