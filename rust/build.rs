use std::fs;
use toml_edit::{value, Document};

/// WE USE THE PRIDE VERSIONING
/// https://pridever.org

fn bump_cargo_version(release: bool) -> Result<String, Box<dyn std::error::Error>> {
    // Read Cargo.toml
    let cargo_toml_content = fs::read_to_string("Cargo.toml")?;
    let mut doc = cargo_toml_content.parse::<Document>()?;

    // Get current version
    let current_version = doc["package"]["version"]
        .as_str()
        .ok_or("Version not found")?;

    // Parse and increment (simple patch increment)
    let parts: Vec<&str> = current_version.split('.').collect();

    let default: u32 = parts[1].parse()?;
    let mut shame: i32 = parts[2].parse()?;

    // set shame to 0 if we have a major release, as new shame patches are coming
    if release {
        shame = -1
    }

    let new_version = format!(
        "{}.{}.{}",
        parts[0],
        if release { default + 1 } else { default },
        shame + 1
    );

    // Update version
    doc["package"]["version"] = value(&new_version);

    // Write back
    fs::write("Cargo.toml", doc.to_string())?;

    Ok(new_version)
}

fn main() {
    #[cfg(windows)]
    {
        println!("cargo:rustc-link-lib=dylib=advapi32");
        println!("cargo:rustc-link-lib=dylib=kernel32");
        println!("cargo:rustc-link-lib=dylib=ntdll");
    }

    let new_version = bump_cargo_version(!cfg!(debug_assertions)).unwrap();
    println!("cargo:info=Building with new version: {new_version}");
}
