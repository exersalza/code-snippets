import sys

LOG_PATH = "c:\\tmp\\log.log"

def main() -> int:
    with open(LOG_PATH, "r", encoding="utf-8") as f:
        print(f.readlines())

    return 0

if __name__ == "__main__":
    sys.exit(main())
