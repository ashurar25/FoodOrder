
import { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    muted: string;
    mutedForeground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    border: string;
    input: string;
    ring: string;
  };
  background: string;
  animatedBackground: string[];
  gradientText: string[];
  headerGradient: string;
  buttonColors: {
    primary: string;
    hover: string;
    accent: string;
  };
}

const themes: ThemeConfig[] = [
  {
    id: "mint",
    name: "มินท์",
    colors: {
      primary: "160 84% 39%",
      primaryForeground: "0 0% 100%",
      secondary: "152 50% 96%",
      secondaryForeground: "160 30% 25%",
      accent: "152 50% 96%",
      accentForeground: "160 30% 25%",
      muted: "152 50% 96%",
      mutedForeground: "160 20% 50%",
      card: "0 0% 100%",
      cardForeground: "160 30% 25%",
      popover: "0 0% 100%",
      popoverForeground: "160 30% 25%",
      border: "152 30% 88%",
      input: "152 30% 88%",
      ring: "160 84% 39%",
    },
    background: "linear-gradient(135deg, #52e5a4 0%, #26d0ce 100%)",
    animatedBackground: [
      "rgba(82, 229, 164, 0.3)",
      "rgba(38, 208, 206, 0.3)",
      "rgba(16, 185, 129, 0.3)"
    ],
    gradientText: ["#52e5a4", "#26d0ce", "#10b981", "#059669"],
    headerGradient: "linear-gradient(135deg, #10b981 0%, #059669 50%, #065f46 100%)",
    buttonColors: {
      primary: "#10b981",
      hover: "#059669",
      accent: "#52e5a4"
    }
  },
  {
    id: "purple",
    name: "ม่วง",
    colors: {
      primary: "262 80% 50%",
      primaryForeground: "0 0% 100%",
      secondary: "270 20% 96%",
      secondaryForeground: "262 30% 25%",
      accent: "270 20% 96%",
      accentForeground: "262 30% 25%",
      muted: "270 20% 96%",
      mutedForeground: "262 15% 50%",
      card: "0 0% 100%",
      cardForeground: "262 30% 25%",
      popover: "0 0% 100%",
      popoverForeground: "262 30% 25%",
      border: "270 20% 88%",
      input: "270 20% 88%",
      ring: "262 80% 50%",
    },
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    animatedBackground: [
      "rgba(120, 119, 198, 0.3)",
      "rgba(255, 119, 198, 0.3)",
      "rgba(120, 219, 255, 0.3)"
    ],
    gradientText: ["#667eea", "#764ba2", "#f093fb", "#f5576c"],
    headerGradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)",
    buttonColors: {
      primary: "#8b5cf6",
      hover: "#7c3aed",
      accent: "#a855f7"
    }
  },
  {
    id: "blue",
    name: "น้ำเงิน",
    colors: {
      primary: "221 83% 53%",
      primaryForeground: "0 0% 100%",
      secondary: "210 40% 96%",
      secondaryForeground: "221 30% 25%",
      accent: "210 40% 96%",
      accentForeground: "221 30% 25%",
      muted: "210 40% 96%",
      mutedForeground: "221 15% 50%",
      card: "0 0% 100%",
      cardForeground: "221 30% 25%",
      popover: "0 0% 100%",
      popoverForeground: "221 30% 25%",
      border: "210 30% 88%",
      input: "210 30% 88%",
      ring: "221 83% 53%",
    },
    background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    animatedBackground: [
      "rgba(59, 130, 246, 0.3)",
      "rgba(30, 64, 175, 0.3)",
      "rgba(96, 165, 250, 0.3)"
    ],
    gradientText: ["#3b82f6", "#1e40af", "#60a5fa", "#2563eb"],
    headerGradient: "linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #1e3a8a 100%)",
    buttonColors: {
      primary: "#3b82f6",
      hover: "#2563eb",
      accent: "#60a5fa"
    }
  }
];

interface ThemeSwitcherProps {
  className?: string;
}

export default function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const [currentTheme, setCurrentTheme] = useState<string>("mint");
  const { toast } = useToast();

  useEffect(() => {
    // Load theme from server
    loadThemeFromServer();
  }, []);

  const loadThemeFromServer = async () => {
    try {
      const response = await fetch('/api/theme-settings');
      if (response.ok) {
        const settings = await response.json();
        const themeId = settings.themeId || "mint";
        setCurrentTheme(themeId);
        applyTheme(themeId);
        localStorage.setItem("theme", themeId);
      } else {
        // Fallback to localStorage
        const savedTheme = localStorage.getItem("theme") || "mint";
        setCurrentTheme(savedTheme);
        applyTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      // Fallback to localStorage
      const savedTheme = localStorage.getItem("theme") || "mint";
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  };

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    
    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVar}`, value);
    });

    // Apply body background
    document.body.style.background = theme.background;
    document.body.style.backgroundAttachment = "fixed";

    // Update animated background
    const animatedBg = document.querySelector('.animated-bg') as HTMLElement;
    if (animatedBg) {
      animatedBg.style.background = `
        radial-gradient(circle at 20% 50%, ${theme.animatedBackground[0]} 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, ${theme.animatedBackground[1]} 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, ${theme.animatedBackground[2]} 0%, transparent 50%)
      `;
    }

    // Update gradient text, header and button styles
    const style = document.createElement('style');
    style.textContent = `
      .gradient-text {
        background: linear-gradient(-45deg, ${theme.gradientText.join(', ')});
        background-size: 400% 400%;
        animation: gradient-shift 4s ease infinite;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      /* Header styling */
      header {
        background: ${theme.headerGradient} !important;
      }
      
      /* Button styling */
      .btn-primary {
        background-color: ${theme.buttonColors.primary} !important;
        border-color: ${theme.buttonColors.primary} !important;
      }
      
      .btn-primary:hover {
        background-color: ${theme.buttonColors.hover} !important;
        border-color: ${theme.buttonColors.hover} !important;
      }
      
      /* Category buttons */
      button[data-active="true"] {
        background-color: ${theme.buttonColors.primary} !important;
        color: white !important;
      }
      
      button[data-active="false"]:hover {
        background-color: ${theme.buttonColors.accent} !important;
        color: white !important;
      }
      
      /* Add to cart buttons */
      .add-to-cart-btn {
        background: linear-gradient(135deg, ${theme.buttonColors.primary} 0%, ${theme.buttonColors.hover} 100%) !important;
      }
      
      .add-to-cart-btn:hover {
        background: linear-gradient(135deg, ${theme.buttonColors.hover} 0%, ${theme.buttonColors.primary} 100%) !important;
        transform: translateY(-1px);
      }
      
      /* Cart button in header */
      .cart-button {
        background-color: rgba(255, 255, 255, 0.2) !important;
      }
      
      .cart-button:hover {
        background-color: rgba(255, 255, 255, 0.3) !important;
      }
      
      /* Bottom navigation styling */
      .nav-active-bg {
        background: linear-gradient(135deg, ${theme.buttonColors.primary} 0%, ${theme.buttonColors.hover} 100%) !important;
      }
      
      .nav-active-pulse {
        background: linear-gradient(135deg, ${theme.buttonColors.accent} 0%, ${theme.buttonColors.primary} 100%) !important;
      }
      
      .nav-hover-bg {
        background: linear-gradient(135deg, ${theme.buttonColors.primary}20 0%, ${theme.buttonColors.accent}20 100%) !important;
      }
    `;
    
    // Remove previous theme style
    const oldStyle = document.getElementById('theme-style');
    if (oldStyle) oldStyle.remove();
    
    style.id = 'theme-style';
    document.head.appendChild(style);
  };

  const handleThemeChange = async (themeId: string) => {
    try {
      // Save to server
      const response = await fetch('/api/theme-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ themeId }),
      });

      if (response.ok) {
        setCurrentTheme(themeId);
        applyTheme(themeId);
        localStorage.setItem("theme", themeId);
        
        toast({
          title: "สำเร็จ",
          description: "บันทึกการตั้งค่าสีธีมแล้ว",
        });
      } else {
        throw new Error('Failed to save theme');
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      // Still apply locally even if server save fails
      setCurrentTheme(themeId);
      applyTheme(themeId);
      localStorage.setItem("theme", themeId);
      
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกการตั้งค่าลงเซิร์ฟเวอร์ได้ แต่จะใช้งานในครั้งนี้",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`bg-white/70 backdrop-blur-md border-white/30 shadow-xl ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-3 text-slate-800">
          <Palette className="w-6 h-6" />
          <span>เปลี่ยนธีมสี</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((theme) => (
            <Button
              key={theme.id}
              variant={currentTheme === theme.id ? "default" : "outline"}
              className={`p-3 h-auto flex-col space-y-2 ${
                currentTheme === theme.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleThemeChange(theme.id)}
            >
              <div 
                className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                style={{ 
                  background: theme.background 
                }}
              />
              <span className="text-xs">{theme.name}</span>
            </Button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-3">
          เลือกธีมสีที่คุณต้องการ การตั้งค่าจะถูกบันทึกอัตโนมัติ
        </p>
      </CardContent>
    </Card>
  );
}
