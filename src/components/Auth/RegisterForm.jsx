import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UserPlus,
  ArrowRight,
  Loader2,
  AlertCircle,
  MapPin,
  User,
} from "lucide-react";
import { register, verifyCode } from "../../store/authSlice";
import { CITIES } from "../../utils/constants";
import Button from "../UI/Button";
import Input from "../UI/Input";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [step, setStep] = useState("register"); // 'register' | 'verify'
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    role: "client",
    code: "",
    userId: null,
  });
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend
  React.useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.city || !formData.role)
      return;

    const result = await dispatch(
      register({
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        role: formData.role,
      })
    );

    if (result.type === "auth/register/fulfilled") {
      setStep("verify");
      setFormData((prev) => ({ ...prev, userId: result.payload.userId }));
      setCountdown(60);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();

    if (!formData.code || !formData.userId) return;

    const result = await dispatch(
      verifyCode({
        userId: formData.userId,
        code: formData.code,
      })
    );

    if (result.type === "auth/verify/fulfilled") {
      // Redirect will be handled by useAuth hook
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    const result = await dispatch(
      register({
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        role: formData.role,
      })
    );

    if (result.type === "auth/register/fulfilled") {
      setCountdown(60);
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    // Add +998 prefix if not present
    if (!value.startsWith("998")) {
      value = "998" + value;
    }
    value = "+" + value;

    // Limit length
    if (value.length <= 13) {
      setFormData((prev) => ({ ...prev, phone: value }));
    }
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

  if (step === "verify") {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Hisobni tasdiqlang
            </h2>
            <p className="text-gray-600">
              {formatPhoneDisplay(formData.phone)} raqamiga yuborilgan kodni
              kiriting
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="6 raqamli kod"
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  code: e.target.value.replace(/\D/g, "").slice(0, 6),
                }))
              }
              maxLength={6}
              className="text-center text-lg tracking-widest"
              autoComplete="one-time-code"
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loading || formData.code.length !== 6}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Hisobni faollashtirish
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResendCode}
              disabled={countdown > 0}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {countdown > 0
                ? `Qayta yuborish (${countdown}s)`
                : "Kodni qayta yuborish"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setStep("register");
                setFormData((prev) => ({ ...prev, code: "", userId: null }));
              }}
              className="text-gray-600 hover:text-gray-700 text-sm"
            >
              ← Ma'lumotlarni o'zgartirish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Ro'yxatdan o'tish
          </h2>
          <p className="text-gray-600">Yangi hisob yarating</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ism *
            </label>
            <Input
              type="text"
              placeholder="Ismingizni kiriting"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value.slice(0, 50),
                }))
              }
              required
              autoComplete="given-name"
              icon={<User className="w-5 h-5" />}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefon raqam *
            </label>
            <Input
              type="tel"
              placeholder="+998 90 123 45 67"
              value={formatPhoneDisplay(formData.phone)}
              onChange={handlePhoneChange}
              required
              autoComplete="tel"
            />
            <p className="mt-1 text-xs text-gray-500">
              O'zbekiston raqamini kiriting
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shahar *
            </label>
            <select
              value={formData.city}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, city: e.target.value }))
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Shaharni tanlang</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kim sifatida ro'yxatdan o'tasiz? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, role: "client" }))
                }
                className={`
                  p-4 border-2 rounded-lg text-left transition-colors
                  ${
                    formData.role === "client"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                <div className="font-medium text-gray-900">Mijoz</div>
                <div className="text-sm text-gray-500">Xizmat qidiraman</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, role: "specialist" }))
                }
                className={`
                  p-4 border-2 rounded-lg text-left transition-colors
                  ${
                    formData.role === "specialist"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                <div className="font-medium text-gray-900">Mutaxassis</div>
                <div className="text-sm text-gray-500">
                  Xizmat taklif qilaman
                </div>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              loading ||
              !formData.name ||
              !formData.phone ||
              !formData.city ||
              !formData.role
            }
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Tasdiqlash kodi yuborish
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Hisobingiz bormi?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Kirish
            </a>
          </p>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Ro'yxatdan o'tish orqali siz{" "}
          <a href="/terms" className="text-blue-600 hover:text-blue-700">
            Foydalanish shartlari
          </a>{" "}
          va{" "}
          <a href="/privacy" className="text-blue-600 hover:text-blue-700">
            Maxfiylik siyosati
          </a>
          ga rozilik bildirasiz.
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
