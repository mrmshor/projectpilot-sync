import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';

export class TauriService {
  // Folder operations
  static async openFolder(path: string): Promise<void> {
    try {
      await invoke('open_folder', { path });
    } catch (error) {
      console.error('Failed to open folder:', error);
      throw error;
    }
  }

  static async selectFolder(): Promise<string | null> {
    try {
      const selected = await open({
        directory: true,
        title: 'Select Folder'
      });
      return selected as string | null;
    } catch (error) {
      console.error('Failed to select folder:', error);
      return null;
    }
  }

  // Communication operations
  static async openWhatsApp(phone: string): Promise<void> {
    try {
      // Clean phone number (remove non-digits)
      const cleanPhone = phone.replace(/\D/g, '');
      await invoke('open_whatsapp', { phone: cleanPhone });
    } catch (error) {
      console.error('Failed to open WhatsApp:', error);
      throw error;
    }
  }

  static async openEmail(email: string, subject?: string, body?: string): Promise<void> {
    try {
      await invoke('open_email', { email, subject, body });
    } catch (error) {
      console.error('Failed to open email:', error);
      throw error;
    }
  }

  static async dialPhone(phone: string): Promise<void> {
    try {
      // Clean phone number (remove non-digits except +)
      const cleanPhone = phone.replace(/[^\d+]/g, '');
      await invoke('dial_phone', { phone: cleanPhone });
    } catch (error) {
      console.error('Failed to dial phone:', error);
      throw error;
    }
  }

  // File operations
  static async fileExists(path: string): Promise<boolean> {
    try {
      return await exists(path);
    } catch (error) {
      console.error('Failed to check file existence:', error);
      return false;
    }
  }

  static async readFile(path: string): Promise<string> {
    try {
      return await readTextFile(path);
    } catch (error) {
      console.error('Failed to read file:', error);
      throw error;
    }
  }

  static async writeFile(path: string, content: string): Promise<void> {
    try {
      await writeTextFile(path, content);
    } catch (error) {
      console.error('Failed to write file:', error);
      throw error;
    }
  }

  // Utility methods
  static isDesktop(): boolean {
    return window.__TAURI__ !== undefined;
  }

  static formatPhoneNumber(phone: string): string {
    // Format phone number for display
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }
}

// Global type declarations for Tauri
declare global {
  interface Window {
    __TAURI__: any;
  }
}