import os, sys
import numpy as np
import OpenEXR, Imath

from PIL import Image

def walk(path: str, max_walk: int) -> list[str]:
    l = []

    for path, _, files in os.walk(path):
        for file in files:
            if not file[-4:] == ".png":
                continue

            l.append(f"{path}\\{file}")

    return l


def main() -> int:
    sys_args = sys.argv[1:]

    if len(sys_args) < 1:
        print(f"Syntax: py {sys.argv[0]} SRC_DIR [MAX_WALK_DISTANCE]")
        return 1

    path = sys_args[0]
    paths = walk(path, 55)

    print(paths)


    return 0


if __name__ == "__main__":
    exit(main())
