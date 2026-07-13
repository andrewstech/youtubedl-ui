#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use tauri::{command, Manager};
use tokio::process::Command;

#[derive(Serialize)]
struct DownloadResult {
    message: String,
}

#[command]
async fn download_video(url: String, output_dir: String, format: String) -> Result<DownloadResult, String> {
    let output = output_dir.trim();
    let target_dir = if output.is_empty() {
        "~/Downloads/youtubedl-ui".to_string()
    } else {
        output.to_string()
    };

    let mut cmd = Command::new("yt-dlp");
    cmd.arg(&url);
    cmd.arg("--output").arg(format!("{}/%(title)s.%(ext)s", target_dir));

    match format.as_str() {
        "audio" => {
            cmd.arg("-x").arg("--audio-format").arg("mp3");
        }
        _ => {
            cmd.arg("-f").arg("bestvideo+bestaudio/best");
        }
    }

    let output = cmd.output().await.map_err(|e| format!("Failed to start yt-dlp: {e}"))?;

    if output.status.success() {
        Ok(DownloadResult {
            message: format!("Download completed. Files were saved to {target_dir}"),
        })
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("yt-dlp failed: {stderr}"))
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![download_video])
        .setup(|app| {
            let _window = app.get_webview_window("main").unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
