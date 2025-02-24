let backend_trigger = ["backend", "server"]
let frontend_trigger = ["frontend"]
let dev_path = $"($env.USERPROFILE)\\development"

def main [path: string, e1: string, e2?: string] {
    mut cmd1 = ""
    mut cmd2 = ""
    if $e1 in $backend_trigger and $path =~ "rust" {
        $cmd1 = "cargo watch -w src/ -x run"

    # i would say, we dont need the $path check here bc i normally only write frontends in ts and preact
    } else if $e1 in $frontend_trigger {
      $cmd1 = "npm run dev"
    }

    if $e2 in $backend_trigger and $path =~ "rust" {
        $cmd2 = "cargo watch -w src/ -x run"
    } else if $e2 in $frontend_trigger {
      $cmd2 = "npm run dev"
    }

    let full_path_e1 = [
      $dev_path
      $path
      $e1
    ] | path join

    wt -d $"($full_path_e1)" "nu.exe" "-c" $cmd1

    if $e2 != null {
      let full_path_e2 = [
        $dev_path
        $path
        $e2
      ] | path join
      wt -d $"($full_path_e2)" "nu.exe" "-c" $cmd2
    }

    let path = [$dev_path $path] | path join
    wt -d $"($path)"
}
