/// &str array to Vec<String>
/// s    a     to v   s
#[macro_export]
macro_rules! satovs {
    // I'M MY PERIMITER AND MY PERIMITER IS ME
    ($in:expr) => {{
        let _: &[&str] = &$in;

        $in.into_iter()
            .map(|i| i.to_string())
            .collect::<Vec<String>>()
    }};

    [$($in:expr),* $(,)?] => {{
        vec![$($in.to_string()),*]
    }}
}
