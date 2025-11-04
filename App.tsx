import React, { useState, useCallback, useEffect } from 'react';
import GameScreen from './components/GameScreen';
import HomeScreen from './components/HomeScreen';
import GameOverScreen from './components/GameOverScreen';
import ShopScreen from './components/ShopScreen';
import GardenScreen from './components/GardenScreen';
// HATA ÇÖZÜMÜ: Eksik 'types' importları eklendi
import { GameState, GardenState, Plant } from './types'; 
import { 
    // HATA ÇÖZÜMÜ: 'constants' dosyasından eksik olan tüm importlar eklendi
    SCREEN_WIDTH, 
    SCREEN_HEIGHT, 
    GOLD_PER_POINT, 
    DP_PER_POINT, 
    PLAYER_STATS_KEY, 
    GARDEN_STATE_KEY, 
    GARDEN_ROWS, 
    GARDEN_COLS, 
    INVENTORY_SLOTS, 
    PLANT_COST, 
    DEFAULT_ADMIN_SETTINGS,
    BASE_FIRE_RATE,
    FIRE_RATE_REDUCTION_PER_LEVEL,
    RAPID_FIRE_RATE,
    FIRE_RATE_UPGRADE_BASE_COST,
    FIRE_RATE_UPGRADE_LEVEL_MULTIPLIER
} from './constants';
import { AdminProvider, useAdmin } from './components/AdminContext';

// HATA ÇÖZÜMÜ: Silinmiş olan 'PlayerStats' arayüzü eklendi
interface PlayerStats {
  gold: number;
  dp: number;
  level: number;
  fireRateLevel: number;
  highScore: number;
  projectileSkin?: 'seed' | 'dart';
}

// HATA ÇÖZÜMÜ: Silinmiş olan 'defaultGardenState' sabiti eklendi
const defaultGardenState: GardenState = {
    plots: Array(GARDEN_ROWS * GARDEN_COLS).fill(null),
    inventory: Array(INVENTORY_SLOTS).fill(null),
    lastCollected: Date.now(),
    gold: 0,
};

const MindGardenApp: React.FC = () => {
  const { setAdminSettings } = useAdmin();
  
  // --- OYUNUN DURUM (STATE) YÖNETİMİ ---
  const [gameState, setGameState] = useState<GameState>(GameState.Home); 
  const [currentScore, setCurrentScore] = useState(0); 
  // HATA ÇÖZÜMÜ: Silinmiş olan 'gameOverInfo' state'i eklendi
  const [gameOverInfo, setGameOverInfo] = useState<{ reason: 'time' | 'lives', isHighScore: boolean }>({ reason: 'time', isHighScore: false });
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    gold: 100, // Start with some gold
    dp: 0,
    level: 1,
    fireRateLevel: 1,
    highScore: 0,
    projectileSkin: 'seed',
  });
  const [gardenState, setGardenState] = useState<GardenState>(defaultGardenState);


  // --- OYUN BAŞLANGICI VE KAYIT YÖNETİMİ ---
  useEffect(() => {
    try {
      const storedStats = localStorage.getItem(PLAYER_STATS_KEY);
      if (storedStats) {
        const parsedStats = JSON.parse(storedStats);
        setPlayerStats(currentStats => ({ ...currentStats, ...parsedStats }));
      }
      const storedGarden = localStorage.getItem(GARDEN_STATE_KEY);
      if (storedGarden) {
        const parsed: GardenState = JSON.parse(storedGarden);
        const need = GARDEN_ROWS * GARDEN_COLS;
        const plots = [...(parsed.plots || [])];
        while (plots.length < need) plots.push(null);
        setGardenState({ ...parsed, plots });
      } else {
        setGardenState(defaultGardenState);
      }
    } catch (error) {
      console.error("Oyuncu verisi yüklenemedi:", error);
    }
  }, []);

  // Oyuncu istatistiklerini güncellediğimizde, bu fonksiyon onları tarayıcıya kaydeder.
  const savePlayerStats = (stats: PlayerStats) => {
    try {
      localStorage.setItem(PLAYER_STATS_KEY, JSON.stringify(stats));
      setPlayerStats(stats);
    } catch (error) {
      console.error("Oyuncu istatistikleri kaydedilemedi:", error);
    }
  };
  
  const saveGardenState = (state: GardenState) => {
     try {
      localStorage.setItem(GARDEN_STATE_KEY, JSON.stringify(state));
      setGardenState(state);
    } catch (error) {
      console.error("Bahçe kaydedilemedi:", error);
    }
  }

  // --- ! DİNAMİK ZORLUK AYARI BURADA ! ---
  const handleStartGame = useCallback(() => {
    setCurrentScore(0);
    
    setAdminSettings(prevSettings => ({
      ...prevSettings,
      // DEĞİŞİKLİK: Buradaki '20' sayısını artırırsanız, oyun her levelde daha ÇOK zorlaşır.
      flowerSpawnInterval: Math.max(200, DEFAULT_ADMIN_SETTINGS.flowerSpawnInterval - (playerStats.level - 1) * 20),
      fireRate: Math.max(RAPID_FIRE_RATE, BASE_FIRE_RATE - (playerStats.fireRateLevel - 1) * FIRE_RATE_REDUCTION_PER_LEVEL)
    }));
    
    setGameState(GameState.Playing);
  }, [playerStats.level, playerStats.fireRateLevel, setAdminSettings]);

  // --- EKRAN GEÇİŞ FONKSİYONLARI ---
  const handleGoHome = useCallback(() => {
    setGameState(GameState.Home);
  }, []);

  const handleGoToShop = useCallback(() => {
    setGameState(GameState.Shop);
  }, []);
  
  const handleGoToGarden = useCallback(() => {
    setGameState(GameState.Garden);
  }, []);

  const handleSelectProjectileSkin = useCallback((skin: 'seed'|'dart') => {
    savePlayerStats({ ...playerStats, projectileSkin: skin });
  }, [playerStats]);


  // --- ! SEVİYE ATLAMA (LEVEL UP) MANTIĞI BURADA ! ---
  const handleGameOver = useCallback((finalScore: number, reason: 'time' | 'lives') => {
    setCurrentScore(finalScore);
    let isNewHighScore = false;

    setPlayerStats(prevStats => {
      const earnedGold = finalScore * GOLD_PER_POINT;
      const earnedDp = finalScore * DP_PER_POINT;
      
      const newDp = prevStats.dp + earnedDp;
      // DEĞİŞİKLİK: Buradaki '100' sayısını artırırsanız (örn: 200), seviye atlamak ZORLAŞIR.
      const levelUpDp = (prevStats.level * 100) + 50; 
      const newLevel = prevStats.level + Math.floor(newDp / levelUpDp);
      const remainingDp = newDp % levelUpDp;
      
      isNewHighScore = finalScore > (prevStats.highScore || 0);

      const newStats: PlayerStats = {
        ...prevStats,
        gold: prevStats.gold + earnedGold,
        dp: remainingDp,
        level: newLevel,
        highScore: isNewHighScore ? finalScore : (prevStats.highScore || 0),
      };

      savePlayerStats(newStats);
      return newStats;
    });

    setGameOverInfo({ reason, isHighScore: isNewHighScore });
    setGameState(GameState.GameOver);
  }, []); // HATA ÇÖZÜMÜ: Bağımlılıklar (dependencies) orijinal haline getirildi

  // --- Market ve Bahçe Fonksiyonları ---
  const handlePurchasePlantOfLevel = useCallback((level: number, cost: number) => {
    if (playerStats.gold >= PLANT_COST) {
        const newInventory = [...gardenState.inventory];
        const emptySlotIndex = newInventory.findIndex(slot => slot === null);
        if (emptySlotIndex !== -1) {
            savePlayerStats({...playerStats, gold: playerStats.gold - PLANT_COST });
            const newPlant: Plant = { id: Date.now(), level: 1 };
            newInventory[emptySlotIndex] = newPlant;
            saveGardenState({...gardenState, inventory: newInventory});
            return true;
        }
    }
    return false;
  }, [playerStats, gardenState]);

  const handleUpgradeFireRate = useCallback(() => {
    const cost = FIRE_RATE_UPGRADE_BASE_COST + (playerStats.fireRateLevel - 1) * FIRE_RATE_UPGRADE_LEVEL_MULTIPLIER;
    if (playerStats.gold >= cost) {
      const newStats = {
        ...playerStats,
        gold: playerStats.gold - cost,
        fireRateLevel: playerStats.fireRateLevel + 1,
      };
      savePlayerStats(newStats);
      return true;
    }
    return false;
  }, [playerStats]);

  const handleUpdateGarden = useCallback((newGardenState: GardenState) => {
    saveGardenState(newGardenState);
  }, []);

  const handleCollectGardenGold = useCallback((amount: number) => {
    savePlayerStats({...playerStats, gold: playerStats.gold + amount});
    saveGardenState({...gardenState, gold: 0, lastCollected: Date.now()});
  }, [playerStats, gardenState]);
  
  // --- HANGİ EKRANIN GÖSTERİLECEĞİNİ SEÇEN BÖLÜM ---
  const renderGameState = () => {
    switch (gameState) {
      case GameState.Home:
        return <HomeScreen onStart={handleStartGame} onGoToShop={handleGoToShop} onGoToGarden={handleGoToGarden} {...playerStats} />;
case GameState.Playing:
        return <GameScreen 
            onGameOver={handleGameOver} 
            onGoHome={handleGoHome} 
            level={playerStats.level} 
            gameState={gameState} // <-- BU SATIRI EKLEYİN
            projectileSkin={playerStats.projectileSkin || 'seed'}
            />;
      case GameState.GameOver:
        return <GameOverScreen 
            score={currentScore} 
            onRestart={handleStartGame} 
            onGoHome={handleGoHome} 
            reason={gameOverInfo.reason}
            isHighScore={gameOverInfo.isHighScore}
            highScore={playerStats.highScore}
            />;
      case GameState.Shop:
        function handlePurchasePlant(): boolean {
          throw new Error('Function not implemented.');
        }

        return (
<ShopScreen
onGoHome={handleGoHome}
onGoToGarden={handleGoToGarden}
gold={playerStats.gold}
onPurchasePlant={handlePurchasePlant}
fireRateLevel={playerStats.fireRateLevel}
onUpgradeFireRate={handleUpgradeFireRate}
onPurchasePlantOfLevel={handlePurchasePlantOfLevel}
projectileSkin={playerStats.projectileSkin || 'seed'}
onSelectProjectileSkin={handleSelectProjectileSkin}
/>
);
      case GameState.Garden:
        return <GardenScreen onGoHome={handleGoHome} onGoToShop={handleGoToShop} gardenState={gardenState} onUpdateGarden={handleUpdateGarden} onCollectGold={handleCollectGardenGold} {...playerStats} />;
      default:
        return null;
    }
  };

  // --- ANA GÖRÜNÜM ---
  return (
    <div className="flex justify-center items-center h-screen w-screen font-sans">
        <main 
        className="relative overflow-hidden shadow-2xl shadow-green-500/20 border-2 border-green-800/50 rounded-lg"
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
        >
        {renderGameState()}
        </main>
    </div>
  );
};


const App: React.FC = () => {
    return (
        <AdminProvider>
            <MindGardenApp />
        </AdminProvider>
    );
}

export default App;
