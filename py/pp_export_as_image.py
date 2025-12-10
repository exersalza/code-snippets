from nt import environ
import win32com.client as win32
import os
import sys

OUTPUT = "C:\\Temp\\pptOutput"

def main() -> int:
    args = sys.argv[1:]

    if len(args) < 1:
        print("Syntax: py exportpp.py <PATH>")
        return 1

    if args[0].startswith(".\\"): # we cant have relative paths, so if the user is not inside the home dir, it wont work. but should always be. otherwise you would just give the file directly
        args[0] = f"{environ.get("USERPROFILE")}\\{args[0]}"
    print(args[0])

    os.makedirs(OUTPUT, exist_ok=True)

    app = win32.Dispatch("PowerPoint.Application")
    app.WindowState = 2 # Headless mode
    pres = app.Presentations.Open(args[0])

    for i, slide in enumerate(pres.Slides, 1):
        if i == 1 or i == pres.Slides.Count:
            continue

        output_path = os.path.join(OUTPUT, f"slide_{i}.png")
        slide.Export(output_path, "PNG", 1920, 1080)  # 1080p PNG

    pres.Close()
    app.Quit()

    return 0


if __name__ == "__main__":
    exit(main())
