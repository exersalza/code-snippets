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

    for path in glob.glob("./**/"):
        server = "server";

        if exists(path + "backend"):
            server = "backend"

        print(path + server)
        f = subprocess.run(f"cd {path + server} && cargo clean", shell=True)

if __name__ == "__main__":
    exit(main())
