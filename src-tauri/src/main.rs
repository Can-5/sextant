#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::PathBuf;

/// Save the exported backup JSON into the user's Downloads folder and
/// return the absolute path, so the webview can show it in a toast.
#[tauri::command]
fn export_json(content: String, filename: String) -> Result<String, String> {
    // Strip any path components so a crafted filename can't escape the dir.
    let safe_name: String = filename
        .chars()
        .filter(|c| !matches!(c, '/' | '\\' | ':' | '\0'))
        .collect();
    let safe_name = safe_name.trim();
    if safe_name.is_empty() {
        return Err("invalid filename".to_string());
    }

    let dir = dirs::download_dir()
        .or_else(dirs::home_dir)
        .ok_or_else(|| "could not locate the Downloads folder".to_string())?;
    let path: PathBuf = dir.join(safe_name);
    fs::write(&path, content).map_err(|e| format!("could not write {}: {e}", path.display()))?;
    Ok(path.to_string_lossy().into_owned())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![export_json])
        .run(tauri::generate_context!())
        .expect("error while running the Sextant application");
}
