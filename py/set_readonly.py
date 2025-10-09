import os
import glob
import stat
import sys

if len(sys.argv) < 3:
    print("Syntax: \"glob_pattern\" <r | a>")
    exit()

excel_files = glob.glob(sys.argv[1])
switch = sys.argv[2]

for file in excel_files:
    if switch == "a":
        os.chmod(file, stat.S_IREAD | stat.S_IRGRP | stat.S_IROTH)
        print(f"Set {file} to readonly.")

    if switch == "r":
        os.chmod(file, stat.S_IWRITE | stat.S_IWGRP | stat.S_IWOTH | stat.S_IREAD | stat.S_IRGRP | stat.S_IROTH)
        print(f"Removed readonly attribute from {file}.")
