import {
    Check,
    Download,
    FileCode,
    Image,
    Link,
    Mail,
    Phone,
    QrCode,
    Type,
    Wifi,
} from "lucide-react";
import QRCode from "qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteConfig } from "../../site.config";

const title = import.meta.env.VITE_SITE_TITLE ?? siteConfig.title;
const description =
    import.meta.env.VITE_SITE_DESCRIPTION ?? siteConfig.description;

type DataType = "text" | "url" | "email" | "phone" | "wifi";
type ExportFormat = "png" | "svg";
type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

const DATA_TYPE_CONFIG: Record<
    DataType,
    { label: string; icon: React.ReactNode; placeholder: string }
> = {
    text: {
        label: "Text",
        icon: <Type className="w-4 h-4" />,
        placeholder: "Enter any text...",
    },
    url: {
        label: "URL",
        icon: <Link className="w-4 h-4" />,
        placeholder: "https://example.com",
    },
    email: {
        label: "Email",
        icon: <Mail className="w-4 h-4" />,
        placeholder: "hello@example.com",
    },
    phone: {
        label: "Phone",
        icon: <Phone className="w-4 h-4" />,
        placeholder: "+1 234 567 8900",
    },
    wifi: {
        label: "Wi-Fi",
        icon: <Wifi className="w-4 h-4" />,
        placeholder: "Network name",
    },
};

function buildQRData(type: DataType, fields: Record<string, string>): string {
    switch (type) {
        case "url":
            return fields.value || "";
        case "email":
            return `mailto:${fields.value || ""}`;
        case "phone":
            return `tel:${fields.value || ""}`;
        case "wifi": {
            const ssid = fields.ssid || "";
            const password = fields.password || "";
            const encryption = fields.encryption || "WPA";
            return `WIFI:T:${encryption};S:${ssid};P:${password};;`;
        }
        default:
            return fields.value || "";
    }
}

const COLOR_PRESETS = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#ffffff" },
    { name: "Slate", value: "#334155" },
    { name: "Teal", value: "#1deecd" },
    { name: "Red", value: "#fd4d2e" },
    { name: "Amber", value: "#f4a60b" },
    { name: "Green", value: "#08c94e" },
    { name: "Blue", value: "#3760f5" },
    { name: "Pink", value: "#fb46be" },
];

const BG_PRESETS = [
    { name: "White", value: "#ffffff" },
    { name: "Snow", value: "#f5f5f5" },
    { name: "Silver", value: "#e0e0e0" },
    { name: "Gray", value: "#bdbdbd" },
    { name: "Dim", value: "#9e9e9e" },
    { name: "Slate", value: "#757575" },
    { name: "Charcoal", value: "#424242" },
    { name: "Near Black", value: "#212121" },
    { name: "Transparent", value: "transparent" },
];

export function QRGenerator() {
    useEffect(() => {
        document.title = title;
    }, []);

    const [dataType, setDataType] = useState<DataType>("url");
    const [fields, setFields] = useState<Record<string, string>>({ value: "" });
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [errorCorrection, setErrorCorrection] =
        useState<ErrorCorrectionLevel>("M");
    const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
    const [qrDataUrl, setQrDataUrl] = useState<string>("");
    const [qrSvg, setQrSvg] = useState<string>("");
    const [copied, setCopied] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const qrData = buildQRData(dataType, fields);

    const generateQR = useCallback(async () => {
        if (!qrData.trim()) {
            setQrDataUrl("");
            setQrSvg("");
            return;
        }

        try {
            // Generate canvas-based QR for display and PNG export
            const canvas = canvasRef.current;
            if (canvas) {
                await QRCode.toCanvas(canvas, qrData, {
                    width: 280,
                    margin: 2,
                    color: {
                        dark: fgColor,
                        light:
                            bgColor === "transparent" ? "#00000000" : bgColor,
                    },
                    errorCorrectionLevel: errorCorrection,
                });
                setQrDataUrl(canvas.toDataURL("image/png"));
            }

            // Generate SVG string
            const svgString = await QRCode.toString(qrData, {
                type: "svg",
                margin: 2,
                color: {
                    dark: fgColor,
                    light: bgColor === "transparent" ? "#00000000" : bgColor,
                },
                errorCorrectionLevel: errorCorrection,
            });
            setQrSvg(svgString);
        } catch {
            // Invalid QR data, clear outputs
            setQrDataUrl("");
            setQrSvg("");
        }
    }, [qrData, fgColor, bgColor, errorCorrection]);

    useEffect(() => {
        generateQR();
    }, [generateQR]);

    const handleExport = () => {
        if (exportFormat === "png") {
            if (!qrDataUrl) return;
            // Re-render at higher resolution for export
            const exportCanvas = document.createElement("canvas");
            const size = 1024;
            exportCanvas.width = size;
            exportCanvas.height = size;
            QRCode.toCanvas(exportCanvas, qrData, {
                width: size,
                margin: 2,
                color: {
                    dark: fgColor,
                    light: bgColor === "transparent" ? "#00000000" : bgColor,
                },
                errorCorrectionLevel: errorCorrection,
            }).then(() => {
                const link = document.createElement("a");
                link.download = "qrcode.png";
                link.href = exportCanvas.toDataURL("image/png");
                link.click();
            });
        } else {
            if (!qrSvg) return;
            const blob = new Blob([qrSvg], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = "qrcode.svg";
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleCopySvg = async () => {
        if (!qrSvg) return;
        await navigator.clipboard.writeText(qrSvg);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const updateField = (key: string, value: string) => {
        setFields((prev) => ({ ...prev, [key]: value }));
    };

    const handleTypeChange = (type: DataType) => {
        setDataType(type);
        setFields(
            type === "wifi"
                ? { ssid: "", password: "", encryption: "WPA" }
                : { value: "" },
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
            {/* Background decorative blobs */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/6 blur-[140px]" />
                <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-chart-2/6 blur-[100px]" />
            </div>

            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20 backdrop-blur-sm">
                        <QrCode className="w-3.5 h-3.5" />
                        QR Generator
                    </div>
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground font-display">
                        {title}
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm">
                        {description}
                    </p>
                </div>

                {/* Main Glass Card */}
                <div className="glass-card rounded-2xl p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Controls */}
                        <div className="space-y-6">
                            {/* Data Type Selector */}
                            <div className="space-y-2.5">
                                <Label className="text-sm font-medium text-foreground/80">
                                    Data Type
                                </Label>
                                <div className="grid grid-cols-5 gap-1.5">
                                    {(
                                        Object.keys(
                                            DATA_TYPE_CONFIG,
                                        ) as DataType[]
                                    ).map((type) => (
                                        <button
                                            type="button"
                                            key={type}
                                            onClick={() =>
                                                handleTypeChange(type)
                                            }
                                            className={`
                        flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-xs font-medium transition-all duration-200
                        ${
                            dataType === type
                                ? "bg-primary/12 text-primary border border-primary/25 shadow-sm"
                                : "bg-white/40 dark:bg-white/5 text-muted-foreground hover:bg-white/70 dark:hover:bg-white/10 border border-transparent hover:border-border/50"
                        }
                      `}
                                        >
                                            {DATA_TYPE_CONFIG[type].icon}
                                            <span className="hidden sm:block">
                                                {DATA_TYPE_CONFIG[type].label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Input Fields */}
                            <div className="space-y-3">
                                {dataType === "wifi" ? (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm text-foreground/70">
                                                Network Name (SSID)
                                            </Label>
                                            <Input
                                                value={fields.ssid || ""}
                                                onChange={(e) =>
                                                    updateField(
                                                        "ssid",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="My WiFi Network"
                                                className="glass-input"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm text-foreground/70">
                                                Password
                                            </Label>
                                            <Input
                                                type="password"
                                                value={fields.password || ""}
                                                onChange={(e) =>
                                                    updateField(
                                                        "password",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Password"
                                                className="glass-input"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm text-foreground/70">
                                                Encryption
                                            </Label>
                                            <Select
                                                value={
                                                    fields.encryption || "WPA"
                                                }
                                                onValueChange={(v) =>
                                                    v &&
                                                    updateField("encryption", v)
                                                }
                                            >
                                                <SelectTrigger className="glass-input">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="WPA">
                                                        WPA/WPA2
                                                    </SelectItem>
                                                    <SelectItem value="WEP">
                                                        WEP
                                                    </SelectItem>
                                                    <SelectItem value="nopass">
                                                        None
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-1.5">
                                        <Label className="text-sm text-foreground/70">
                                            {DATA_TYPE_CONFIG[dataType].label}
                                        </Label>
                                        <Input
                                            value={fields.value || ""}
                                            onChange={(e) =>
                                                updateField(
                                                    "value",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={
                                                DATA_TYPE_CONFIG[dataType]
                                                    .placeholder
                                            }
                                            className="glass-input"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Customization */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-foreground/80">
                                        Appearance
                                    </Label>
                                </div>

                                {/* Color Picker */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">
                                        Foreground Color
                                    </Label>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {COLOR_PRESETS.map((preset) => (
                                            <button
                                                type="button"
                                                key={preset.value}
                                                onClick={() =>
                                                    setFgColor(preset.value)
                                                }
                                                className={`
                          w-7 h-7 rounded-lg transition-all duration-200 border-2
                          ${
                              fgColor === preset.value
                                  ? "border-primary scale-110 shadow-md"
                                  : preset.value === "#ffffff"
                                    ? "border-border hover:scale-105"
                                    : "border-transparent hover:scale-105"
                          }
                        `}
                                                style={{
                                                    backgroundColor:
                                                        preset.value,
                                                }}
                                                title={preset.name}
                                            />
                                        ))}
                                        <div className="relative">
                                            <input
                                                type="color"
                                                value={fgColor}
                                                onChange={(e) =>
                                                    setFgColor(e.target.value)
                                                }
                                                className="absolute inset-0 w-7 h-7 opacity-0 cursor-pointer"
                                            />
                                            <div
                                                className="w-7 h-7 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors"
                                                title="Custom color"
                                            >
                                                <span className="text-[10px] font-bold">
                                                    +
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Background Color */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">
                                        Background Color
                                    </Label>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {BG_PRESETS.map((preset) => (
                                            <button
                                                type="button"
                                                key={preset.value}
                                                onClick={() =>
                                                    setBgColor(preset.value)
                                                }
                                                className={`
                          w-7 h-7 rounded-lg transition-all duration-200 border-2
                          ${
                              bgColor === preset.value
                                  ? "border-primary scale-110 shadow-md"
                                  : [
                                          "#ffffff",
                                          "#f5f5f5",
                                          "#e0e0e0",
                                          "transparent",
                                      ].includes(preset.value)
                                    ? "border-border hover:scale-105"
                                    : "border-transparent hover:scale-105"
                          }
                          ${preset.value === "transparent" ? "checkerboard" : ""}
                        `}
                                                style={
                                                    preset.value !==
                                                    "transparent"
                                                        ? {
                                                              backgroundColor:
                                                                  preset.value,
                                                          }
                                                        : undefined
                                                }
                                                title={preset.name}
                                            />
                                        ))}
                                        <div className="relative">
                                            <input
                                                type="color"
                                                value={
                                                    bgColor === "transparent"
                                                        ? "#ffffff"
                                                        : bgColor
                                                }
                                                onChange={(e) =>
                                                    setBgColor(e.target.value)
                                                }
                                                className="absolute inset-0 w-7 h-7 opacity-0 cursor-pointer"
                                            />
                                            <div
                                                className="w-7 h-7 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors"
                                                title="Custom color"
                                            >
                                                <span className="text-[10px] font-bold">
                                                    +
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Error Correction */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground">
                                        Error Correction
                                    </Label>
                                    <div className="grid grid-cols-4 gap-1">
                                        {(
                                            [
                                                "L",
                                                "M",
                                                "Q",
                                                "H",
                                            ] as ErrorCorrectionLevel[]
                                        ).map((level) => (
                                            <button
                                                type="button"
                                                key={level}
                                                onClick={() =>
                                                    setErrorCorrection(level)
                                                }
                                                className={`
                          py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                          ${
                              errorCorrection === level
                                  ? "bg-primary/12 text-primary border border-primary/25"
                                  : "bg-white/40 dark:bg-white/5 text-muted-foreground hover:bg-white/60 dark:hover:bg-white/8 border border-transparent"
                          }
                        `}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: QR Preview & Export */}
                        <div className="flex flex-col items-center gap-6">
                            {/* QR Preview */}
                            <div
                                className={`
                  relative w-full max-w-[320px] aspect-square rounded-2xl flex items-center justify-center
                  ${bgColor === "transparent" ? "checkerboard" : ""}
                  border border-border/40 shadow-inner
                `}
                                style={
                                    bgColor !== "transparent"
                                        ? { backgroundColor: bgColor }
                                        : undefined
                                }
                            >
                                <canvas
                                    ref={canvasRef}
                                    className={`${qrData.trim() ? "" : "hidden"}`}
                                />
                                {!qrData.trim() && (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                                        <QrCode className="w-16 h-16" />
                                        <span className="text-sm">
                                            Enter data to generate
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Export Controls */}
                            <div className="w-full max-w-[320px] space-y-3">
                                <Tabs
                                    value={exportFormat}
                                    onValueChange={(v) =>
                                        setExportFormat(v as ExportFormat)
                                    }
                                    className="w-full"
                                >
                                    <TabsList className="w-full glass-tabs">
                                        <TabsTrigger
                                            value="png"
                                            className="flex-1 gap-1.5 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-white/10"
                                        >
                                            <Image className="w-3.5 h-3.5" />
                                            PNG
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="svg"
                                            className="flex-1 gap-1.5 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-white/10"
                                        >
                                            <FileCode className="w-3.5 h-3.5" />
                                            SVG
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="png" className="mt-3">
                                        <Button
                                            onClick={handleExport}
                                            disabled={!qrData.trim()}
                                            className="w-full glass-button"
                                            size="lg"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download PNG
                                        </Button>
                                    </TabsContent>

                                    <TabsContent
                                        value="svg"
                                        className="mt-3 space-y-2"
                                    >
                                        <Button
                                            onClick={handleExport}
                                            disabled={!qrData.trim()}
                                            className="w-full glass-button"
                                            size="lg"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download SVG
                                        </Button>
                                        <Button
                                            onClick={handleCopySvg}
                                            disabled={!qrData.trim()}
                                            variant="outline"
                                            className="w-full"
                                            size="lg"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-4 h-4 mr-2 text-emerald-500" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <FileCode className="w-4 h-4 mr-2" />
                                                    Copy SVG Code
                                                </>
                                            )}
                                        </Button>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground/50 mt-6">
                    QR codes are generated client-side. No data is sent to any
                    server.
                </p>
            </div>
        </div>
    );
}
