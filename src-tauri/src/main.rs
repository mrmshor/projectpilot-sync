// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use std::process::Command;

// Tauri commands for native functionality
#[tauri::command]
async fn open_folder(path: String) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Failed to open folder: {}", e))?;
    }
    
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Failed to open folder: {}", e))?;
    }
    
    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Failed to open folder: {}", e))?;
    }
    
    Ok(())
}

#[tauri::command]
async fn open_whatsapp(phone: String) -> Result<(), String> {
    let whatsapp_url = format!("whatsapp://send?phone={}", phone);
    
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(&whatsapp_url)
            .spawn()
            .map_err(|e| format!("Failed to open WhatsApp: {}", e))?;
    }
    
    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(["/C", "start", "", &whatsapp_url])
            .spawn()
            .map_err(|e| format!("Failed to open WhatsApp: {}", e))?;
    }
    
    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(&whatsapp_url)
            .spawn()
            .map_err(|e| format!("Failed to open WhatsApp: {}", e))?;
    }
    
    Ok(())
}

#[tauri::command]
async fn open_email(email: String, subject: Option<String>, body: Option<String>) -> Result<(), String> {
    let mut mailto_url = format!("mailto:{}", email);
    
    let mut params = Vec::new();
    if let Some(subj) = subject {
        params.push(format!("subject={}", urlencoding::encode(&subj)));
    }
    if let Some(body_text) = body {
        params.push(format!("body={}", urlencoding::encode(&body_text)));
    }
    
    if !params.is_empty() {
        mailto_url.push('?');
        mailto_url.push_str(&params.join("&"));
    }
    
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(&mailto_url)
            .spawn()
            .map_err(|e| format!("Failed to open email: {}", e))?;
    }
    
    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(["/C", "start", "", &mailto_url])
            .spawn()
            .map_err(|e| format!("Failed to open email: {}", e))?;
    }
    
    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(&mailto_url)
            .spawn()
            .map_err(|e| format!("Failed to open email: {}", e))?;
    }
    
    Ok(())
}

#[tauri::command]
async fn dial_phone(phone: String) -> Result<(), String> {
    let tel_url = format!("tel:{}", phone);
    
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(&tel_url)
            .spawn()
            .map_err(|e| format!("Failed to dial phone: {}", e))?;
    }
    
    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(["/C", "start", "", &tel_url])
            .spawn()
            .map_err(|e| format!("Failed to dial phone: {}", e))?;
    }
    
    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(&tel_url)
            .spawn()
            .map_err(|e| format!("Failed to dial phone: {}", e))?;
    }
    
    Ok(())
}

#[tauri::command]
async fn select_folder() -> Result<Option<String>, String> {
    use tauri_plugin_dialog::{DialogExt, MessageDialogBuilder};
    
    // This would need to be implemented with the dialog plugin
    // For now, return a placeholder
    Ok(Some("/Users".to_string()))
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            open_folder,
            open_whatsapp,
            open_email,
            dial_phone,
            select_folder
        ])
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}