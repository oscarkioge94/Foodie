import React, { useState, useEffect, useRef } from "react";
import { Image as ImageIcon, Link as LinkIcon, Upload as UploadIcon, Check, Loader2, AlertCircle, RefreshCw } from "lucide-react";

export const IMAGE_PRESETS = [
  { label: "Botanical Greens", url: "/images/becca_foodies_botanical_greens_1784115212572.jpg" },
  { label: "Garden Sandwich", url: "/images/sandwich.png" },
  { label: "Seasonal Berries", url: "/images/seasonal.jpeg" },
  { label: "Coastal Sea Bass", url: "/images/becca_foodies_coastal_harvest_1784115225586.jpg" },
  { label: "Healthy Smoothie", url: "/images/Smoothie.png" },
  { label: "Kenyan Street Food", url: "/images/street.png" },
  { label: "The Weight Loss Journey", url: "/images/The_journey.png" },
  { label: "Balanced Dieting", url: "/images/Dieting.png" },
  { label: "Healthy Life Celebration", url: "/images/ChatGPT_Image_Jul_1_2026_12_50_23_PM.png" },
  { label: "Fresh Kenyan Staples", url: "/images/WhatsApp_Image_2026-07-02_at_12.34.26.jpeg" }
];

interface ImageSourceSelectorProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

type TabType = "preset" | "url" | "local";

export default function ImageSourceSelector({ value, onChange, label = "Featured Image" }: ImageSourceSelectorProps) {
  const [activeTab, setActiveTab] = useState<TabType>("preset");
  const [urlInput, setUrlInput] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionError, setCompressionError] = useState("");
  const [localFileInfo, setLocalFileInfo] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize/detect the source type from value
  useEffect(() => {
    if (!value) {
      setActiveTab("preset");
    } else if (value.startsWith("data:image/")) {
      setActiveTab("local");
    } else {
      const isPreset = IMAGE_PRESETS.some((preset) => preset.url === value);
      if (isPreset) {
        setActiveTab("preset");
      } else {
        setActiveTab("url");
        setUrlInput(value);
      }
    }
  }, [value]);

  // Handle URL change
  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setUrlInput(newVal);
    onChange(newVal);
  };

  // Canvas-based image compression
  const compressAndConvertToBase64 = (file: File): Promise<{ dataUrl: string; size: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const maxDimension = 1000; // Optimal size for high quality but lightweight files
            let width = img.width;
            let height = img.height;

            // Scale down if exceeds maxDimension
            if (width > height) {
              if (width > maxDimension) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              }
            } else {
              if (height > maxDimension) {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              resolve({
                dataUrl: event.target?.result as string,
                size: `${Math.round(file.size / 1024)} KB`
              });
              return;
            }

            // Draw with smooth scaling
            ctx.drawImage(img, 0, 0, width, height);
            
            // Compress to JPEG with 0.8 quality
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
            
            // Calculate approximate size of Base64 string
            const base64Length = compressedDataUrl.length - (compressedDataUrl.indexOf(",") + 1);
            const compressedSizeKb = Math.round((base64Length * 3) / 4 / 1024);

            resolve({
              dataUrl: compressedDataUrl,
              size: `${compressedSizeKb} KB`
            });
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => reject(new Error("Failed to load image."));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setCompressionError("Please select a valid image file.");
      return;
    }

    setIsCompressing(true);
    setCompressionError("");

    try {
      const result = await compressAndConvertToBase64(file);
      onChange(result.dataUrl);
      setLocalFileInfo({
        name: file.name,
        size: result.size
      });
    } catch (err) {
      console.error("Image processing error:", err);
      setCompressionError("Failed to process and compress the image. Try another file.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="font-mono text-[9px] font-bold uppercase tracking-wider block text-primary-teal">
        {label}
      </label>

      {/* Tabs */}
      <div className="grid grid-cols-3 border-2 border-primary-teal bg-cream-bg">
        <button
          type="button"
          onClick={() => setActiveTab("preset")}
          className={`py-2 text-[10px] font-mono uppercase font-bold flex items-center justify-center space-x-1.5 border-r border-primary-teal/20 transition-colors ${
            activeTab === "preset"
              ? "bg-primary-teal text-white-card"
              : "text-primary-teal hover:bg-primary-teal/5"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Preset</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("url")}
          className={`py-2 text-[10px] font-mono uppercase font-bold flex items-center justify-center space-x-1.5 border-r border-primary-teal/20 transition-colors ${
            activeTab === "url"
              ? "bg-primary-teal text-white-card"
              : "text-primary-teal hover:bg-primary-teal/5"
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Web URL</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("local")}
          className={`py-2 text-[10px] font-mono uppercase font-bold flex items-center justify-center space-x-1.5 transition-colors ${
            activeTab === "local"
              ? "bg-primary-teal text-white-card"
              : "text-primary-teal hover:bg-primary-teal/5"
          }`}
        >
          <UploadIcon className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-3.5 border-2 border-t-0 border-primary-teal bg-cream-bg/30 -mt-3">
        {activeTab === "preset" && (
          <div className="space-y-3">
            <span className="text-[10px] font-sans text-gray-body/70 block">
              Select one of our curated premium food assets:
            </span>
            <div className="grid grid-cols-5 gap-1.5 max-h-[145px] overflow-y-auto pr-1">
              {IMAGE_PRESETS.map((preset, idx) => {
                const isSelected = value === preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onChange(preset.url)}
                    className={`aspect-square relative border-2 overflow-hidden transition-all duration-200 group ${
                      isSelected
                        ? "border-gold-yellow scale-[0.96] ring-2 ring-gold-yellow/20"
                        : "border-primary-teal/20 hover:border-primary-teal/60"
                    }`}
                    title={preset.label}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary-teal/10 flex items-center justify-center">
                        <div className="bg-gold-yellow p-0.5 rounded-full shadow border border-primary-teal">
                          <Check className="w-3 h-3 text-primary-teal stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "url" && (
          <div className="space-y-2">
            <span className="text-[10px] font-sans text-gray-body/70 block">
              Paste an external image URL from Unsplash, Pexels, or any web host:
            </span>
            <input
              type="url"
              value={urlInput}
              onChange={handleUrlInputChange}
              placeholder="e.g. https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
              className="w-full px-3 py-2 bg-cream-bg border border-primary-teal font-sans text-xs text-primary-teal placeholder-primary-teal/40 focus:outline-none focus:border-gold-yellow"
            />
            {urlInput && !urlInput.startsWith("http") && (
              <span className="text-[9px] text-pink-red font-mono flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                URL must start with http:// or https://
              </span>
            )}
          </div>
        )}

        {activeTab === "local" && (
          <div className="space-y-2">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-none p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-gold-yellow bg-gold-yellow/5"
                  : "border-primary-teal/30 hover:border-primary-teal/70 bg-cream-bg"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {isCompressing ? (
                <div className="flex flex-col items-center justify-center py-2 space-y-2">
                  <Loader2 className="w-6 h-6 text-primary-teal animate-spin" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-primary-teal">
                    Optimizing Image...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1.5">
                  <UploadIcon className="w-5 h-5 text-primary-teal/60" />
                  <div>
                    <span className="font-mono text-[9px] font-bold uppercase text-primary-teal">
                      Click or drag image
                    </span>
                    <span className="font-sans text-[9px] text-gray-body/60 block mt-0.5">
                      Accepts PNG, JPG, JPEG, WEBP
                    </span>
                  </div>
                </div>
              )}
            </div>

            {compressionError && (
              <span className="text-[9px] text-pink-red font-mono flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                {compressionError}
              </span>
            )}

            {value.startsWith("data:image/") && !isCompressing && (
              <div className="bg-primary-teal/5 border border-primary-teal/10 p-2 flex items-center justify-between text-left">
                <div className="overflow-hidden mr-2">
                  <span className="font-mono text-[8px] uppercase text-primary-teal/60 block">
                    Current Loaded File
                  </span>
                  <span className="font-sans text-[10px] font-semibold text-primary-teal truncate block">
                    {localFileInfo?.name || "Device Upload"}
                  </span>
                  {localFileInfo?.size && (
                    <span className="font-mono text-[8px] text-gray-body/60">
                      Size: {localFileInfo.size} (Optimized for Database)
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 bg-cream-bg text-primary-teal hover:bg-gold-yellow border border-primary-teal/20 hover:border-primary-teal transition-all flex items-center justify-center"
                  title="Replace file"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Unified Live Preview */}
        {value && (
          <div className="mt-3.5 space-y-1.5">
            <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-primary-teal/60 block">
              Live Preview
            </span>
            <div className="aspect-video w-full border border-primary-teal overflow-hidden bg-cream-bg shadow-inner relative group">
              <img
                src={value}
                alt="Form Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/sandwich.png";
                }}
              />
              <div className="absolute bottom-2 left-2 bg-dark-green/80 text-white-card font-mono text-[8px] px-1.5 py-0.5 border border-gold-yellow/30 uppercase tracking-widest backdrop-blur-xs">
                {activeTab === "preset"
                  ? "Preset Asset"
                  : activeTab === "url"
                  ? "Web Image"
                  : "Device Upload"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
