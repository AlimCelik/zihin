import { ReactNode } from 'react';

// HATA DÜZELTMESİ: 'export' kelimesi eklendi
export enum GameState {
  Home,
  Playing,
  GameOver,
  Shop,
  Garden,
}

// HATA DÜZELTMESİ: 'export' kelimesi eklendi
export enum PowerUpType {
  SlowMotion,
  RapidFire,
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Player {
  position: Vector2D;
  size: { width: number; height: number; };
  lives: number;
  isHit?: boolean;
}

export interface Flower {
  id: number;
  position: Vector2D;
  size: number;
  type: number; 
  velocity: Vector2D;
  health: number;
  maxHealth: number;
  isHit?: boolean;
  enemyType?: 'standard' | 'sniper' | 'dasher' | 'tank';
  lastShotTime?: number;
  stopY?: number;
}

export interface Projectile {
  id: number;
  position: Vector2D;
  size: number;
}

export interface EnemyProjectile {
  id: number;
  position: Vector2D;
  size: number;
  velocity: Vector2D;
}

export interface ScorePopup {
  id: number;
  position: Vector2D;
  value: string;
  opacity: number;
}

export interface PowerUp {
  id: number;
  type: PowerUpType;
  position: Vector2D;
  size: number;
}

export interface Particle {
  id: number;
  position: Vector2D;
  velocity: Vector2D;
  color: string;
  size: number;
  opacity: number;
}

export interface Explosion {
  id: number;
  particles: Particle[];
}

export interface Plant {
  id: number;
  level: number;
}

export type GardenPlot = Plant | null;

export interface GardenState {
    plots: GardenPlot[];
    inventory: GardenPlot[];
    lastCollected: number;
    gold: number;
} 

export interface AdminSettings {
  gameDuration: number;
  fireRate: number;
  flowerSpeedMultiplier: number;
  flowerSpawnInterval: number;
  powerUpSpawnInterval: number;
  baseScorePerFlower: number;
  baseFlowerHealth: number;
  projectileDamage: number; // Mermi gücü ayarı
}

export interface AdminContextType {
  adminSettings: AdminSettings;
  setAdminSettings: React.Dispatch<React.SetStateAction<AdminSettings>>;
  isPanelOpen: boolean;
  setPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}