fn gen_sorted_vec(len: i32) -> Vec<i32> {
    let mut ret = vec![];

    for i in 0..len + 1 {
        ret.push(i.pow(2));
    }

    ret
}

fn binary_search(stack: &[i32], needle: i32) -> bool {
    if stack.is_empty() {
        return false;
    }

    let mid = stack.len() / 2;

    if stack[mid] == needle {
        return true;
    }

    if stack[mid] > needle {
        return binary_search(&stack[..mid], needle);
    }

    binary_search(&stack[mid + 1..], needle)
}

fn merge_sorted(src: &[i32], merge: &[i32]) -> Vec<i32> {
    let mut i = 0;
    let mut j = 0;
    let mut ret = vec![];

    while i < src.len() && j < merge.len() {
        if src[i] < merge[j] {
            ret.push(src[i]);
            i += 1;
        } else {
            ret.push(merge[j]);
            j += 1;
        }
    }

    if i < src.len() {
        ret.extend_from_slice(&merge[i..]);
    }

    if j < merge.len() {
        ret.extend_from_slice(&merge[j..]);
    }

    ret
}

fn remove_duplicates(nums: &mut Vec<i32>) -> usize {
    // Your code here
    //let mut c = 0;
    //
    //while c <= nums.len() {
    //    // might be an logic mistake, will test
    //    let in_c = c+1;
    //    if nums.len() <= in_c{
    //        break;
    //    }
    //
    //    if nums[c] == nums[in_c] {
    //        nums.remove(in_c);
    //        continue;
    //    }
    //
    //    c += 1;
    //}

    if nums.is_empty() {
        return nums.len();
    }

    let mut i = 0;

    for j in 1..nums.len() {
        if nums[j] != nums[i] {
            i += 1;
            nums[i] = nums[j];
        }
    }

    i + 1
}

type Graph = Vec<Vec<usize>>;

fn dfs(graph: &Graph, start_node: usize) -> Vec<usize> {
    let mut visited = vec![false; graph.len()];

    todo!()
}

fn two_sum_ii(input: &[i32], target: i32) -> (usize, usize) {
    let mut i = 0;
    let mut j = input.len() - 1;

    loop {
        let cla = input[j] + input[i];

        if cla < target {
            i += 1;
            continue;
        }

        if cla > target {
            j -= 1;
            continue;
        }

        return (i + 1, j + 1);
    }
}

fn max_area(height: &[i32]) -> i32 {
    let mut left = 0;
    let mut right = height.len() - 1;

    let mut big_area = 0;

    while left < right {
        let new_area = std::cmp::min(height[left], height[right]) * (right - left) as i32;
        if new_area > big_area {
            big_area = new_area;
        }

        if height[left] < height[right] {
            left += 1;
        } else {
            right -= 1;
        }
    }

    big_area
}

fn is_palindrome(s: &str) -> bool {
    let s: Vec<u8> = s
        .chars()
        .filter(|i| i.is_alphanumeric())
        .map(|i| i.to_ascii_lowercase() as u8)
        .collect();

    if s.is_empty() {
        return true;
    }

    let mut left = 0;
    let mut right = s.len() - 1;

    while left < right {
        if s[left] != s[right] {
            return false;
        }

        left += 1;
        right -= 1;
    }
    true
}

fn main() {
    let start = std::time::Instant::now();

    assert_eq!(is_palindrome("A man, a plan, a canal: Panama"), true);
    assert_eq!(is_palindrome("race a car"), false);
    assert_eq!(is_palindrome("No 'x' in Nixon"), true);
    let stop = std::time::Instant::now();
    dbg!(stop - start);
}
