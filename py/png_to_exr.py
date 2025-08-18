import os
import sys
from concurrent.futures import ProcessPoolExecutor
import numpy as np
import OpenEXR, Imath
from PIL import Image
import math

def chunk_list[T](input: list[T], size: int):
    for i in range(0, len(input), size):
        yield input[i:i+size]

def walk(path: str, max_walk: int) -> list[str]:
    l = []
    for walk_path, _, files in os.walk(path):
        for file in files:
            depth = os.path.relpath(walk_path, path).count(os.sep)
            if depth > max_walk:
                continue
            if not file[-4:].lower() == ".png":
                continue
            l.append(os.path.join(walk_path, file))
    return l

def convert_to_exr(path) -> bool:
    exr = os.path.join(path[:-4] + ".exr")


    # open image and convert to float32 [0,1]
    img = Image.open(path).convert("RGBA")
    arr = np.array(img).astype(np.float32) / 255.0

    exr_out = OpenEXR.OutputFile(exr, OpenEXR.Header(arr.shape[1], arr.shape[0]))

    R = arr[:,:,0].tobytes()
    G = arr[:,:,1].tobytes()
    B = arr[:,:,2].tobytes()
    A = arr[:,:,3].tobytes()

    exr_out.writePixels({'R': R, 'G': G, 'B': B, 'A': A})
    exr_out.close()

    print(f"Converted {path} -> {os.path.basename(exr)}")
    return False


def do_convertion(paths: list[str]):
    for i in paths:
        convert_to_exr(i)


def main() -> int:
    sys_args = sys.argv[1:]
    print(sys_args)

    if len(sys_args) < 1:
        print(f"Syntax: py {sys.argv} SRC_DIR [MAX_WALK_DIST 55] [MAX_PROCS 4]")
        return 1

    path = sys_args[0]
    depth = 55
    procs = 4

    if len(sys_args) >= 2:
        try:
            depth = int(sys_args[1])
        except ValueError:
            print("MAX_WALK_DIST is not Numeric, setting to 55")

    if len(sys_args) >= 3:
        try:
            procs = int(sys_args[2])
        except ValueError:
            print("MAX_PROCS is not Numeric, setting to 4")

    paths = walk(path, depth)

    with ProcessPoolExecutor(max_workers=procs) as executor:
        list(executor.map(convert_to_exr, paths))
    return 0


if __name__ == "__main__":
    exit(main())
