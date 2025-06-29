import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Shield,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { verifyUser, resendCode } from "../../store/authSlice";
import Button from "../UI/Button";
import Input from "../UI/Input";

const VerifyForm = ({ userId, phone, type = "register" }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code || code.length !== 6) return;

    const result = await dispatch(
      verifyUser({
        userId,
        code: code.trim(),
      })
    );

    if (result.type === "auth/verify/fulfilled") {
      // Success - redirect will be handled by useAuth hook
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    const result = await dispatch(resendCode({ userId }));

    if (result.type === "auth/resendCode/fulfilled") {
      setCountdown(60);
      setCanResend(false);
      setCode("");
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  };

  const formatPhoneDisplay = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length >= 12) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(
        5,
        8
      )} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
    }
    return phone;
  };

  const getTitle = () => {
    switch (type) {
      case "register":
        return "Hisobni tasdiqlang";
      case "login":
        return "Kirish tasdiqlash";
      case "phone-change":
        return "Telefon raqamni tasdiqlang";
      default:
        return "Tasdiqlash kodi";
    }
  };

  const getDescription = () => {
    switch (type) {
      case "register":
        return "Hisobingizni faollashtirish uchun tasdiqlash kodini kiriting";
      case "login":
        return "Xavfsiz kirish uchun tasdiqlash kodini kiriting";
      case "phone-change":
        return "Yangi telefon raqamingizni tasdiqlang";
      default:
        return "Tasdiqlash kodini kiriting";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {getTitle()}
          </h2>
          <p className="text-gray-600 mb-2">{getDescription()}</p>
          <p className="text-sm text-gray-500">
            Kod yuborildi: {formatPhoneDisplay(phone)}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tasdiqlash kodi
            </label>
            <Input
              type="text"
              placeholder="000000"
              value={code}
              onChange={handleCodeChange}
              maxLength={6}
              className="text-center text-lg tracking-widest font-mono"
              autoComplete="one-time-code"
              autoFocus
            />
            <p className="mt-1 text-xs text-gray-500 text-center">
              6 raqamli kodni kiriting
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || code.length !== 6}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Tasdiqlash
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResendCode}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Kodni qayta yuborish</span>
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Qayta yuborish mumkin: {countdown}s
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Kod kelmadimi? Spam papkangizni tekshiring yoki
            <br />
            telefon raqamingiz to'g'riligini tasdiqlang
          </p>
        </div>

        {/* Code input helper */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Maslahat:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Kod odatda 1-2 daqiqada keladi</li>
            <li>• Kod 10 daqiqa davomida amal qiladi</li>
            <li>• Har bir kod faqat bir marta ishlatiladi</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VerifyForm;
