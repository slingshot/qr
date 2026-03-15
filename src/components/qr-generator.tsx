import {
    Check,
    ChevronDown,
    ChevronUp,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
        icon: <Type className="w-3.5 h-3.5" />,
        placeholder: "Enter any text...",
    },
    url: {
        label: "URL",
        icon: <Link className="w-3.5 h-3.5" />,
        placeholder: "https://example.com",
    },
    email: {
        label: "Email",
        icon: <Mail className="w-3.5 h-3.5" />,
        placeholder: "hello@example.com",
    },
    phone: {
        label: "Phone",
        icon: <Phone className="w-3.5 h-3.5" />,
        placeholder: "+1 234 567 8900",
    },
    wifi: {
        label: "WiFi",
        icon: <Wifi className="w-3.5 h-3.5" />,
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

function SlingshotLogo({ height = 20 }: { height?: number }) {
    const aspectRatio = 323 / 62;
    const width = Math.round(height * aspectRatio);
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 323 62"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Slingshot"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M30.5 61C47.3447 61 61 47.3447 61 30.5C61 13.6553 47.3447 0 30.5 0C13.6553 0 0 13.6553 0 30.5C0 38.9226 3.414 46.5477 8.93366 52.0672C8.93376 52.0671 8.93386 52.067 8.93397 52.0669L13.7172 47.2702L18.5107 42.4769C21.8273 45.7901 26.174 47.4435 30.5207 47.4368C31.0706 47.4368 31.6172 47.4069 32.1639 47.3535C32.334 47.3358 32.4997 47.3094 32.6659 47.2829C32.7505 47.2694 32.8352 47.2558 32.9207 47.2435C32.9666 47.2372 33.0126 47.231 33.0587 47.2248C33.3068 47.1915 33.5565 47.158 33.804 47.1102C34.0087 47.0696 34.2102 47.0173 34.4106 46.9652C34.4907 46.9443 34.5707 46.9235 34.6506 46.9035C34.7084 46.8893 34.7659 46.8754 34.8234 46.8615C35.0213 46.8137 35.2176 46.7662 35.4139 46.7068C35.6219 46.6441 35.8243 46.5702 36.0266 46.4963C36.0934 46.4719 36.1603 46.4475 36.2273 46.4235C36.2852 46.4029 36.3431 46.3827 36.4009 46.3625C36.5961 46.2944 36.7903 46.2266 36.9806 46.1469C37.1653 46.0715 37.343 45.9855 37.5213 45.8992C37.5875 45.8672 37.6538 45.8351 37.7206 45.8035C37.777 45.7771 37.8334 45.7511 37.8896 45.7251C38.0897 45.6328 38.2888 45.5408 38.484 45.4368C38.6493 45.3483 38.8081 45.2517 38.9672 45.155C39.0359 45.1132 39.1046 45.0714 39.174 45.0302C39.2481 44.9855 39.3225 44.9418 39.3969 44.898C39.5669 44.7981 39.737 44.6981 39.904 44.5868C40.0865 44.4635 40.2606 44.3318 40.4347 44.2001C40.5054 44.1466 40.5761 44.0931 40.6473 44.0402C40.713 43.9912 40.7794 43.9433 40.8459 43.8954C40.9783 43.8 41.1108 43.7045 41.2373 43.6002C42.1007 42.8901 42.8939 42.0969 43.604 41.2335C43.6985 41.1184 43.7854 40.9982 43.8726 40.8776C43.9268 40.8027 43.9811 40.7276 44.0374 40.6535C44.0785 40.5991 44.1199 40.5449 44.1614 40.4907C44.3082 40.2987 44.4555 40.1061 44.5907 39.9035C44.7059 39.7294 44.8103 39.5517 44.9145 39.3744C44.952 39.3107 44.9894 39.247 45.0273 39.1835C45.066 39.119 45.1052 39.0547 45.1445 38.9904C45.2472 38.8222 45.3499 38.6538 45.444 38.4802C45.5409 38.3008 45.6256 38.1179 45.7107 37.934C45.7426 37.865 45.7746 37.7959 45.8073 37.7268C45.8421 37.6522 45.8775 37.5782 45.9129 37.5043C45.996 37.3304 46.0791 37.1569 46.1539 36.9768C46.2276 36.8009 46.2895 36.6233 46.3515 36.4452C46.3765 36.3736 46.4015 36.3018 46.4273 36.2301C46.4439 36.1847 46.4606 36.1393 46.4773 36.094C46.5611 35.8668 46.6445 35.6408 46.714 35.4101C46.7683 35.2247 46.8136 35.0394 46.8592 34.8526C46.8751 34.7875 46.891 34.7223 46.9074 34.6568C46.9238 34.5931 46.9407 34.5296 46.9575 34.4661C47.0154 34.2471 47.0734 34.0283 47.1174 33.8035C47.1568 33.6034 47.185 33.4002 47.2131 33.1971C47.2253 33.1091 47.2375 33.0212 47.2506 32.9335C47.2625 32.8512 47.2755 32.7689 47.2885 32.6863C47.3155 32.5148 47.3427 32.3423 47.3607 32.1669C47.4107 31.6336 47.4373 31.0969 47.4407 30.5602C47.4407 30.5501 47.4415 30.5401 47.4423 30.5301C47.4432 30.5201 47.444 30.5101 47.444 30.5001C47.444 28.6268 48.9606 27.1102 50.8339 27.1102C52.7039 27.1102 54.224 28.6301 54.2206 30.5069C54.2206 31.2969 54.1806 32.0768 54.1039 32.8468C54.0819 33.079 54.0451 33.3096 54.0083 33.5408C53.9896 33.6581 53.9709 33.7757 53.954 33.8935C53.9389 33.9987 53.9243 34.104 53.9098 34.2094C53.8668 34.5215 53.8238 34.8336 53.764 35.1401C53.7034 35.4403 53.6257 35.7386 53.5481 36.0365C53.5232 36.1322 53.4983 36.2279 53.4739 36.3235C53.4468 36.4314 53.4208 36.5395 53.3948 36.6475C53.3349 36.8969 53.275 37.1459 53.2006 37.3901C53.1063 37.6971 52.9947 38.0019 52.8833 38.3063C52.8567 38.3787 52.8302 38.4511 52.804 38.5234C52.7698 38.6188 52.7363 38.7145 52.7029 38.8101C52.6124 39.0687 52.5219 39.3271 52.4173 39.5802C52.3183 39.8196 52.205 40.0559 52.0917 40.2922C52.0409 40.3981 51.9901 40.504 51.9406 40.6102C51.8965 40.7037 51.853 40.7975 51.8095 40.8912C51.6857 41.1581 51.5621 41.4244 51.424 41.6835C51.3036 41.9061 51.1708 42.124 51.0383 42.3415C50.9764 42.4432 50.9145 42.5448 50.8539 42.6468C50.7917 42.7503 50.7306 42.8544 50.6695 42.9584C50.528 43.1996 50.3866 43.4406 50.2307 43.6735C50.0419 43.9526 49.8362 44.2232 49.6304 44.4939C49.5782 44.5626 49.526 44.6313 49.474 44.7001C49.4033 44.7945 49.3344 44.8897 49.2656 44.9847C49.1303 45.1715 48.9954 45.3578 48.8473 45.5369C48.3573 46.1369 47.8373 46.7168 47.2772 47.2768C46.7173 47.8368 46.1373 48.3601 45.5373 48.8502C45.3585 48.9981 45.1724 49.1328 44.9857 49.268C44.8905 49.3369 44.7952 49.4059 44.7006 49.4768C44.6254 49.5336 44.5503 49.5909 44.4753 49.6482C44.211 49.8499 43.9466 50.0518 43.674 50.2335C43.4229 50.4017 43.1623 50.5548 42.9009 50.7084C42.8152 50.7588 42.7295 50.8091 42.644 50.8601C42.5433 50.9198 42.4434 50.9809 42.3434 51.042C42.1256 51.175 41.9079 51.308 41.6839 51.4269C41.4291 51.5641 41.1635 51.6869 40.8977 51.8098C40.8019 51.8541 40.706 51.8984 40.6106 51.9434C40.5036 51.9933 40.3972 52.0445 40.2909 52.0957C40.0561 52.2086 39.8215 52.3215 39.5806 52.4201C39.3278 52.5246 39.0696 52.615 38.8113 52.7054C38.7155 52.7389 38.6196 52.7725 38.524 52.8068C38.4358 52.8385 38.348 52.8706 38.2603 52.9026C37.9701 53.0086 37.6816 53.1139 37.3873 53.2035C37.1416 53.2761 36.8909 53.3371 36.64 53.3982C36.5334 53.4241 36.4269 53.45 36.3206 53.4769C36.224 53.5014 36.1273 53.5266 36.0306 53.5518C35.7338 53.6291 35.4365 53.7065 35.1373 53.7668C34.8291 53.8269 34.5152 53.8702 34.2012 53.9134C34.0976 53.9277 33.994 53.9419 33.8906 53.9568C33.7738 53.9735 33.6569 53.9921 33.54 54.0106C33.3069 54.0476 33.0738 54.0846 32.8406 54.1069C32.0706 54.1802 31.2906 54.2235 30.5007 54.2235C26.6139 54.2235 22.734 53.2635 19.224 51.3635L18.5207 52.0669L14.2636 56.3239C18.9652 59.2862 24.5324 61 30.5 61ZM30.4999 40.6665C36.1148 40.6665 40.6665 36.1148 40.6665 30.4999C40.6665 24.8849 36.1148 20.3332 30.4999 20.3332C24.885 20.3332 20.3332 24.8849 20.3332 30.4999C20.3332 36.1148 24.885 40.6665 30.4999 40.6665ZM30.5004 33.89C32.3727 33.89 33.8904 32.3723 33.8904 30.5C33.8904 28.6278 32.3727 27.1101 30.5004 27.1101C28.6282 27.1101 27.1103 28.6278 27.1103 30.5C27.1103 32.3723 28.6282 33.89 30.5004 33.89ZM30.5 6.77628C17.4 6.77628 6.77668 17.3962 6.77668 30.4996C6.77668 32.3695 8.29335 33.8896 10.1667 33.8896C12.04 33.8896 13.5567 32.3729 13.5567 30.4996C13.5567 21.1429 21.1433 13.5562 30.5 13.5562C32.37 13.5562 33.89 12.0395 33.89 10.1662C33.89 8.29622 32.37 6.77628 30.5 6.77628Z"
            />
            <path d="M88.3969 51.3027C96.5056 51.3027 101.324 47.836 101.324 41.1963C101.324 34.6153 97.0932 32.6763 89.3958 31.5599C84.9302 30.9136 83.4612 30.1497 83.4612 28.2107C83.4612 26.3304 85.0477 25.0377 87.8093 25.0377C90.7473 25.0377 92.1575 26.2129 92.6275 28.7395H100.442C99.6785 21.6885 94.5665 19.2206 87.7506 19.2206C81.4634 19.2206 75.5876 22.3936 75.5876 28.7983C75.5876 34.7916 78.7605 37.142 86.928 38.3759C91.3348 39.0222 93.1563 39.9036 93.1563 42.0189C93.1563 44.1342 91.6286 45.3681 88.3382 45.3681C84.6364 45.3681 83.2849 43.7816 82.9324 41.02H75C75.2938 47.6597 80.112 51.3027 88.3969 51.3027Z" />
            <path d="M105.787 50.6564H114.248V6H105.787V50.6564Z" />
            <path d="M125.252 15.7539C128.013 15.7539 130.129 13.7561 130.129 11.112C130.129 8.46785 128.013 6.47007 125.252 6.47007C122.549 6.47007 120.434 8.46785 120.434 11.112C120.434 13.7561 122.549 15.7539 125.252 15.7539ZM121.08 50.6564H129.541V19.9257H121.08V50.6564Z" />
            <path d="M136.195 50.6564H144.715V32.9113C144.715 28.3869 147.477 26.1541 151.12 26.1541C154.881 26.1541 156.526 28.1519 156.526 32.3238V50.6564H165.046V31.0898C165.046 22.8637 160.757 19.2206 154.704 19.2206C149.592 19.2206 146.243 21.7473 144.715 24.8027V19.9257H136.195V50.6564Z" />
            <path d="M184.802 61.9967C194.909 61.9967 200.961 57.3548 201.02 48.2473V19.9257H192.559V24.5089C190.796 21.3947 187.799 19.2206 182.805 19.2206C175.166 19.2206 169.29 25.3903 169.29 34.204V34.6153C169.29 43.7229 175.225 49.3049 182.687 49.3049C187.212 49.3049 190.855 46.6021 192.559 43.6054V48.2473C192.559 53.0655 189.973 55.7684 184.802 55.7684C180.454 55.7684 178.515 54.0056 177.986 51.3027H169.525C170.348 57.6486 174.872 61.9967 184.802 61.9967ZM185.214 42.9003C180.983 42.9003 177.986 39.7273 177.986 34.6153V34.1453C177.986 29.0921 180.631 25.6841 185.39 25.6841C190.032 25.6841 192.794 28.857 192.794 34.0865V34.4978C192.794 39.7273 189.679 42.9003 185.214 42.9003Z" />
            <path d="M218.515 51.3027C226.623 51.3027 231.441 47.836 231.441 41.1963C231.441 34.6153 227.211 32.6763 219.514 31.5599C215.048 30.9136 213.579 30.1497 213.579 28.2107C213.579 26.3304 215.165 25.0377 217.927 25.0377C220.865 25.0377 222.275 26.2129 222.745 28.7395H230.56C229.796 21.6885 224.684 19.2206 217.868 19.2206C211.581 19.2206 205.705 22.3936 205.705 28.7983C205.705 34.7916 208.878 37.142 217.046 38.3759C221.453 39.0222 223.274 39.9036 223.274 42.0189C223.274 44.1342 221.746 45.3681 218.456 45.3681C214.754 45.3681 213.403 43.7816 213.05 41.02H205.118C205.412 47.6597 210.23 51.3027 218.515 51.3027Z" />
            <path d="M235.669 50.6564H244.189V32.9113C244.189 28.3869 246.951 26.1541 250.594 26.1541C254.355 26.1541 256 28.1519 256 32.3238V50.6564H264.52V31.0898C264.52 22.8637 260.23 19.2206 254.178 19.2206C249.066 19.2206 245.717 21.7473 244.189 24.8027V6H235.669V50.6564Z" />
            <path d="M284.923 51.3027C294.148 51.3027 301.14 45.1331 301.14 35.438V34.9679C301.14 25.3903 294.206 19.2206 284.981 19.2206C275.756 19.2206 268.764 25.5078 268.764 35.1442V35.6142C268.764 45.1918 275.756 51.3027 284.923 51.3027ZM284.981 44.8393C280.163 44.8393 277.46 41.3138 277.46 35.438V34.9679C277.46 29.0921 280.281 25.6841 284.981 25.6841C289.741 25.6841 292.502 29.2096 292.502 35.0854V35.4967C292.502 41.3138 289.741 44.8393 284.981 44.8393Z" />
            <path d="M316.9 51.244C319.191 51.244 320.895 50.8327 322.07 50.4213V43.8404C321.071 44.2517 320.131 44.428 318.839 44.428C316.665 44.428 315.431 43.2528 315.431 40.785V25.9779H321.894V19.9257H315.431V13.286H306.969V19.9257H303.033V25.9779H306.969V41.5488C306.969 47.9535 310.436 51.244 316.9 51.244Z" />
        </svg>
    );
}

export function QRGenerator() {
    useEffect(() => {
        document.title = title;
    }, []);

    const [dataType, setDataType] = useState<DataType>("url");
    const [fields, setFields] = useState<Record<string, string>>({
        value: "",
    });
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [errorCorrection, setErrorCorrection] =
        useState<ErrorCorrectionLevel>("M");
    const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
    const [qrDataUrl, setQrDataUrl] = useState<string>("");
    const [qrSvg, setQrSvg] = useState<string>("");
    const [copied, setCopied] = useState(false);
    const [showCustomize, setShowCustomize] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const qrData = buildQRData(dataType, fields);

    const generateQR = useCallback(async () => {
        if (!qrData.trim()) {
            setQrDataUrl("");
            setQrSvg("");
            return;
        }

        try {
            const canvas = canvasRef.current;
            if (canvas) {
                await QRCode.toCanvas(canvas, qrData, {
                    width: 260,
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
        <div className="min-h-dvh flex flex-col overflow-auto">
            {/* Header */}
            <header
                className="fixed top-0 left-0 right-0 z-50 border-b border-[#282828]"
                style={{
                    backdropFilter: "blur(17.5px)",
                    WebkitBackdropFilter: "blur(17.5px)",
                    background: "rgba(0,0,0,0.75)",
                }}
            >
                <div className="max-w-[960px] mx-auto px-6 h-16 flex items-center">
                    <a
                        href="https://slingshot.fm?utm_source=qr&utm_medium=logo&utm_campaign=oss"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f8f8f8] hover:opacity-70 transition-opacity"
                    >
                        <SlingshotLogo height={20} />
                    </a>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 pt-24 pb-16 px-6">
                <div className="max-w-[780px] mx-auto flex flex-col gap-10">
                    {/* Hero */}
                    <div>
                        <h1 className="text-[20px] leading-tight font-semibold tracking-[-0.2px] text-[#f8f8f8] font-display">
                            {title}
                        </h1>
                        <p className="text-[12px] leading-[1.5] text-[#d1d1d1] mt-2 max-w-[600px]">
                            {description}
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="card-glass p-5">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6">
                            {/* Left: Controls */}
                            <div className="space-y-5">
                                {/* Data Type Selector */}
                                <div className="space-y-2">
                                    <span className="block text-[14px] leading-[1.5] font-medium text-[#f8f8f8]">
                                        Data Type
                                    </span>
                                    <div className="flex flex-wrap gap-1">
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
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors ${
                                                    dataType === type
                                                        ? "bg-[rgba(255,255,255,0.07)] text-[#f8f8f8] border border-[#3e3e3e]"
                                                        : "text-[#afafaf] hover:bg-[rgba(255,255,255,0.03)] border border-transparent"
                                                }`}
                                            >
                                                {DATA_TYPE_CONFIG[type].icon}
                                                <span className="hidden sm:inline">
                                                    {
                                                        DATA_TYPE_CONFIG[type]
                                                            .label
                                                    }
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
                                                <span className="block text-[12px] leading-[1.5] text-[#afafaf]">
                                                    Network Name (SSID)
                                                </span>
                                                <input
                                                    value={fields.ssid || ""}
                                                    onChange={(e) =>
                                                        updateField(
                                                            "ssid",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="My WiFi Network"
                                                    className="w-full h-[34px] rounded-[4px] border border-[#282828] bg-[#1c1c1c] px-[14px] text-[14px] text-[#f8f8f8] placeholder:text-[#afafaf] outline-none focus:border-[#4f4f4f] transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <span className="block text-[12px] leading-[1.5] text-[#afafaf]">
                                                    Password
                                                </span>
                                                <input
                                                    type="password"
                                                    value={
                                                        fields.password || ""
                                                    }
                                                    onChange={(e) =>
                                                        updateField(
                                                            "password",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Password"
                                                    className="w-full h-[34px] rounded-[4px] border border-[#282828] bg-[#1c1c1c] px-[14px] text-[14px] text-[#f8f8f8] placeholder:text-[#afafaf] outline-none focus:border-[#4f4f4f] transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <span className="block text-[12px] leading-[1.5] text-[#afafaf]">
                                                    Encryption
                                                </span>
                                                <Select
                                                    value={
                                                        fields.encryption ||
                                                        "WPA"
                                                    }
                                                    onValueChange={(v) =>
                                                        v &&
                                                        updateField(
                                                            "encryption",
                                                            v,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-full h-[34px] rounded-[4px] border-[#282828] bg-[#1c1c1c] text-[14px] text-[#f8f8f8]">
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
                                            <span className="block text-[12px] leading-[1.5] text-[#afafaf]">
                                                {
                                                    DATA_TYPE_CONFIG[dataType]
                                                        .label
                                                }
                                            </span>
                                            <input
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
                                                className="w-full h-[34px] rounded-[4px] border border-[#282828] bg-[#1c1c1c] px-[14px] text-[14px] text-[#f8f8f8] placeholder:text-[#afafaf] outline-none focus:border-[#4f4f4f] transition-colors"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-[#3e3e3e]" />

                                {/* Customize Accordion */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCustomize(!showCustomize)
                                        }
                                        className="flex items-center justify-between w-full text-[14px] leading-[1.5] font-medium text-[#f8f8f8] hover:text-[#d1d1d1] transition-colors"
                                    >
                                        Customize
                                        {showCustomize ? (
                                            <ChevronUp className="w-4 h-4 text-[#afafaf]" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-[#afafaf]" />
                                        )}
                                    </button>

                                    {showCustomize && (
                                        <div className="mt-4 space-y-4">
                                            {/* Foreground Color */}
                                            <div className="space-y-1.5">
                                                <span className="block text-[12px] leading-[1.5] text-[#afafaf]">
                                                    Foreground Color
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {COLOR_PRESETS.map(
                                                        (preset) => (
                                                            <button
                                                                type="button"
                                                                key={
                                                                    preset.value
                                                                }
                                                                onClick={() =>
                                                                    setFgColor(
                                                                        preset.value,
                                                                    )
                                                                }
                                                                className={`w-6 h-6 rounded-[4px] transition-all border ${
                                                                    fgColor ===
                                                                    preset.value
                                                                        ? "border-[#f8f8f8] scale-110"
                                                                        : preset.value ===
                                                                                "#ffffff" ||
                                                                            preset.value ===
                                                                                "#000000"
                                                                          ? "border-[#3e3e3e] hover:scale-105"
                                                                          : "border-transparent hover:scale-105"
                                                                }`}
                                                                style={{
                                                                    backgroundColor:
                                                                        preset.value,
                                                                }}
                                                                title={
                                                                    preset.name
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                    <div className="relative">
                                                        <input
                                                            type="color"
                                                            value={fgColor}
                                                            onChange={(e) =>
                                                                setFgColor(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="absolute inset-0 w-6 h-6 opacity-0 cursor-pointer"
                                                        />
                                                        <div
                                                            className="w-6 h-6 rounded-[4px] border border-dashed border-[#4f4f4f] flex items-center justify-center text-[#afafaf] hover:border-[#f8f8f8] transition-colors cursor-pointer"
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
                                            <div className="space-y-1.5">
                                                <span className="block text-[12px] leading-[1.5] text-[#afafaf]">
                                                    Background Color
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {BG_PRESETS.map(
                                                        (preset) => (
                                                            <button
                                                                type="button"
                                                                key={
                                                                    preset.value
                                                                }
                                                                onClick={() =>
                                                                    setBgColor(
                                                                        preset.value,
                                                                    )
                                                                }
                                                                className={`w-6 h-6 rounded-[4px] transition-all border ${
                                                                    bgColor ===
                                                                    preset.value
                                                                        ? "border-[#f8f8f8] scale-110"
                                                                        : [
                                                                                "#ffffff",
                                                                                "#f5f5f5",
                                                                                "#e0e0e0",
                                                                                "transparent",
                                                                            ].includes(
                                                                                preset.value,
                                                                            )
                                                                          ? "border-[#3e3e3e] hover:scale-105"
                                                                          : "border-transparent hover:scale-105"
                                                                } ${preset.value === "transparent" ? "checkerboard" : ""}`}
                                                                style={
                                                                    preset.value !==
                                                                    "transparent"
                                                                        ? {
                                                                              backgroundColor:
                                                                                  preset.value,
                                                                          }
                                                                        : undefined
                                                                }
                                                                title={
                                                                    preset.name
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                    <div className="relative">
                                                        <input
                                                            type="color"
                                                            value={
                                                                bgColor ===
                                                                "transparent"
                                                                    ? "#ffffff"
                                                                    : bgColor
                                                            }
                                                            onChange={(e) =>
                                                                setBgColor(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="absolute inset-0 w-6 h-6 opacity-0 cursor-pointer"
                                                        />
                                                        <div
                                                            className="w-6 h-6 rounded-[4px] border border-dashed border-[#4f4f4f] flex items-center justify-center text-[#afafaf] hover:border-[#f8f8f8] transition-colors cursor-pointer"
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
                                                <span className="block text-[12px] leading-[1.5] text-[#afafaf]">
                                                    Error Correction
                                                </span>
                                                <div className="flex gap-1">
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
                                                                setErrorCorrection(
                                                                    level,
                                                                )
                                                            }
                                                            className={`px-3 py-1.5 rounded-[4px] text-[12px] font-medium transition-colors ${
                                                                errorCorrection ===
                                                                level
                                                                    ? "bg-[rgba(255,255,255,0.07)] text-[#f8f8f8]"
                                                                    : "text-[#afafaf] hover:bg-[rgba(255,255,255,0.03)]"
                                                            }`}
                                                        >
                                                            {level}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Preview & Export */}
                            <div className="flex flex-col items-center gap-4">
                                {/* QR Preview */}
                                <div
                                    className={`w-full max-w-[260px] mx-auto md:mx-0 aspect-square rounded-[6px] border border-[#3e3e3e] flex items-center justify-center overflow-hidden ${
                                        bgColor === "transparent"
                                            ? "checkerboard"
                                            : ""
                                    }`}
                                    style={
                                        bgColor !== "transparent"
                                            ? { backgroundColor: bgColor }
                                            : undefined
                                    }
                                >
                                    <canvas
                                        ref={canvasRef}
                                        className={`max-w-full ${qrData.trim() ? "" : "hidden"}`}
                                    />
                                    {!qrData.trim() && (
                                        <div className="flex flex-col items-center gap-2 text-[#afafaf]">
                                            <QrCode className="w-12 h-12 opacity-40" />
                                            <span className="text-[12px]">
                                                Enter data to generate
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Format Tabs */}
                                <div className="w-full max-w-[260px] mx-auto md:mx-0 flex gap-1 p-[3px] rounded-[6px] bg-[rgba(255,255,255,0.03)]">
                                    <button
                                        type="button"
                                        onClick={() => setExportFormat("png")}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[4px] text-[12px] font-medium transition-colors ${
                                            exportFormat === "png"
                                                ? "bg-[rgba(255,255,255,0.07)] text-[#f8f8f8]"
                                                : "text-[#afafaf] hover:text-[#d1d1d1]"
                                        }`}
                                    >
                                        <Image className="w-3.5 h-3.5" />
                                        PNG
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setExportFormat("svg")}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[4px] text-[12px] font-medium transition-colors ${
                                            exportFormat === "svg"
                                                ? "bg-[rgba(255,255,255,0.07)] text-[#f8f8f8]"
                                                : "text-[#afafaf] hover:text-[#d1d1d1]"
                                        }`}
                                    >
                                        <FileCode className="w-3.5 h-3.5" />
                                        SVG
                                    </button>
                                </div>

                                {/* Download Button */}
                                <button
                                    type="button"
                                    onClick={handleExport}
                                    disabled={!qrData.trim()}
                                    className="w-full max-w-[260px] mx-auto md:mx-0 h-[38px] rounded-[6px] bg-[#f8f8f8] text-[#000000] text-[12px] font-medium hover:bg-[#d1d1d1] disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download {exportFormat.toUpperCase()}
                                </button>

                                {/* Copy SVG Code (only when SVG selected) */}
                                {exportFormat === "svg" && (
                                    <button
                                        type="button"
                                        onClick={handleCopySvg}
                                        disabled={!qrData.trim()}
                                        className="w-full max-w-[260px] mx-auto md:mx-0 h-[38px] rounded-[6px] border border-[#282828] bg-transparent text-[#f8f8f8] text-[12px] font-medium hover:bg-[rgba(255,255,255,0.03)] disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center justify-center gap-2"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4 text-green-400" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <FileCode className="w-4 h-4" />
                                                Copy SVG Code
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Privacy note */}
                    <p className="text-[10px] leading-[1.5] text-[#afafaf] text-center">
                        QR codes are generated client-side. No data is sent to
                        any server.
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full pb-6">
                <div className="max-w-[960px] mx-auto px-6">
                    {/* Powered by */}
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <span className="text-[10px] leading-[1.5] text-[#afafaf]">
                            Powered by
                        </span>
                        <a
                            href="https://slingshot.fm?utm_source=qr&utm_medium=footer&utm_campaign=oss"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f8f8f8] hover:opacity-70 transition-opacity"
                        >
                            <SlingshotLogo height={18} />
                        </a>
                        <span className="text-[10px] leading-[1.5] text-[#afafaf]">
                            Modern business management for artists & creatives
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-[#f8f8f8] opacity-20 mb-4" />

                    {/* Links */}
                    <div className="flex justify-between text-[10px] leading-[1.5] text-[#d1d1d1] font-medium">
                        <div className="flex gap-4">
                            <a
                                href="https://slingshot.fm/terms"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#f8f8f8] transition-colors"
                            >
                                Terms
                            </a>
                            <a
                                href="https://slingshot.fm/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#f8f8f8] transition-colors"
                            >
                                Privacy
                            </a>
                        </div>
                        <div className="flex gap-4">
                            <a
                                href="https://slingshot.fm/help"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#f8f8f8] transition-colors"
                            >
                                Help
                            </a>
                            <a
                                href="https://slingshot.fm/dmca"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#f8f8f8] transition-colors"
                            >
                                DMCA
                            </a>
                            <a
                                href="https://github.com/slingshot/qr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#f8f8f8] transition-colors"
                            >
                                Source
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
