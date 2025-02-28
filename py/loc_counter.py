import sys
import os
import re
import operator
import random

filter = (".rs", ".ts", ".js", ".tsx", ".jsx", ".py", ".html", ".css")
blacklist = ["venv", "target", "dist", "node_modules", ".git"]
loc = {}

# TODO: doc counter

def form_blacklist() -> str:
    ret = ".*("

    for i in blacklist:
        ret += f"({i})|"

    return ret[: len(ret) - 1] + ").*"


def count_lines(path: str):
    lines = 0

    with open(path, "r") as f:
        lines = len(f.readlines())

    loc[path] = lines
    return lines


def find_biggest() -> list[tuple[ str, int ]]:
    sorted_dict = dict(sorted(loc.items(), key=operator.itemgetter(1)))
    ret: list[ tuple[ str, int ] ] = [(i[0], i[1]) for i in sorted_dict.items()]

    return [ret[-1], ret[-2], ret[-3]]


def main() -> int:
    bl_re = form_blacklist()

    for i in os.walk("."):
        path = i[0]

        if re.match(bl_re, path):
            continue

        files = i[2]
        for j in files:
            if not j.endswith(filter) or "config" in j:
                continue
            count_lines(f"{path}\\{j}")

    count = 0

    for _, value in loc.items():
        count += value

    print(f"{count} Lines of code\n")
    print("Top 3 Storage hogs: ")

    for i in find_biggest():
        print(f"{i[0]} with {i[1]} lines and a size of {os.path.getsize(i[0])/1000:.2f}KB")

    

    if random.randint(0,10) == 9:
        # NOTE: very important
        print(chr(sum(range(ord(min(str(not())))))))

    return 0


if __name__ == "__main__":
    sys.exit(main())
