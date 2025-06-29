import React, { useState, useEffect } from "react";
import {
  Search,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Shield,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Card from "../components/UI/Card";
import { useAuth } from "../hooks/useAuth";

// Mock data
const featuredCategories = [
  {
    id: 1,
    name: "IT va Dasturlash",
    icon: "💻",
    specialists: 1250,
    trending: true,
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Dizayn va San'at",
    icon: "🎨",
    specialists: 890,
    color: "bg-pink-500",
  },
  {
    id: 3,
    name: "Marketing va Reklama",
    icon: "📢",
    specialists: 675,
    trending: true,
    color: "bg-yellow-500",
  },
  {
    id: 4,
    name: "Ta'lim va Tarbiya",
    icon: "🎓",
    specialists: 1100,
    color: "bg-green-500",
  },
  {
    id: 5,
    name: "Muhandislik",
    icon: "⚙️",
    specialists: 520,
    color: "bg-indigo-500",
  },
  {
    id: 6,
    name: "Tibbiyot",
    icon: "🏥",
    specialists: 340,
    color: "bg-red-500",
  },
];

const featuredSpecialists = [
  {
    id: 1,
    name: "Abdulloh Karimov",
    title: "Senior Full-Stack Developer",
    rating: 4.9,
    reviews: 127,
    price: 50000,
    location: "Toshkent",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    verified: true,
    online: true,
    skills: ["React", "Node.js", "MongoDB"],
  },
  {
    id: 2,
    name: "Malika Nurmatova",
    title: "UI/UX Designer",
    rating: 4.8,
    reviews: 89,
    price: 35000,
    location: "Samarqand",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    verified: true,
    online: false,
    skills: ["Figma", "Adobe XD", "Photoshop"],
  },
  {
    id: 3,
    name: "Bobur Rakhmatov",
    title: "Digital Marketing Expert",
    rating: 4.7,
    reviews: 156,
    price: 40000,
    location: "Andijon",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    verified: true,
    online: true,
    skills: ["SMM", "Google Ads", "SEO"],
  },
];

const stats = [
  { label: "Faol mutaxassislar", value: "10,000+", icon: Users },
  { label: "Tugallangan loyihalar", value: "50,000+", icon: TrendingUp },
  { label: "Mijozlar reytingi", value: "4.8/5", icon: Star },
  { label: "Tekshirilgan mutaxassislar", value: "95%", icon: Shield },
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    // Navigate to search results
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              O'zbekistondagi eng yaxshi{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                mutaxassislarni
              </span>{" "}
              toping
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-slide-up">
              Professional xizmatlar, ishonchli mutaxassislar va qulay to'lov
              tizimi
            </p>

            {/* Search Form */}
            <div className="max-w-2xl mx-auto mb-8 animate-slide-up">
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                <Input
                  type="text"
                  placeholder="Qanday xizmat qidiryapsiz?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white/30"
                  icon={Search}
                />
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
                >
                  Qidirish
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* Popular searches */}
            <div className="flex flex-wrap justify-center gap-2 animate-slide-up">
              <span className="text-blue-200">Mashhur qidiruvlar:</span>
              {["Veb dizayn", "Mobile ilova", "SMM", "Copywriting"].map(
                (term) => (
                  <button
                    key={term}
                    className="px-3 py-1 bg-white/20 rounded-full text-sm hover:bg-white/30 transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mashhur kategoriyalar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Eng ko'p qidirilayotgan xizmatlar bo'yicha professional
              mutaxassislarni toping
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <Card key={category.id} hover className="group cursor-pointer">
                <div className="flex items-center p-6">
                  <div
                    className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white text-2xl mr-4 group-hover:scale-110 transition-transform`}
                  >
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.specialists} mutaxassis
                    </p>
                  </div>
                  {category.trending && (
                    <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      Trend
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="secondary" size="lg">
              Barcha kategoriyalar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Specialists */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top mutaxassislar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Yuqori reytingga ega bo'lgan va ishonchli mutaxassislar bilan
              tanishing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSpecialists.map((specialist) => (
              <Card key={specialist.id} hover className="group">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="relative">
                      <img
                        src={specialist.avatar}
                        alt={specialist.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {specialist.online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center">
                        <h3 className="font-semibold text-gray-900">
                          {specialist.name}
                        </h3>
                        {specialist.verified && (
                          <Shield className="w-4 h-4 text-blue-500 ml-2" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {specialist.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900 ml-1">
                        {specialist.rating}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">
                        ({specialist.reviews})
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {specialist.location}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {specialist.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-900 font-semibold">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {specialist.price.toLocaleString()} so'm/soat
                    </div>
                    <Button size="sm">Ko'rish</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="secondary" size="lg">
              Barcha mutaxassislar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Qanday ishlaydi?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Uch oddiy qadamda o'zingizga mos mutaxassisni toping
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Qidiring",
                description:
                  "Kerakli xizmat turini tanlang va mutaxassislarni qidiring",
                icon: Search,
                color: "bg-blue-500",
              },
              {
                step: 2,
                title: "Tanlang",
                description:
                  "Reytinglar va sharhlar asosida eng mos mutaxassisni tanlang",
                icon: Users,
                color: "bg-green-500",
              },
              {
                step: 3,
                title: "Ishlang",
                description:
                  "Loyihangizni boshlang va natijalardan rohatlaning",
                icon: TrendingUp,
                color: "bg-purple-500",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div
                  className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center text-white mx-auto mb-6`}
                >
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {item.step}. {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-gray-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Hoziroq boshlangsiz!
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Minglab professional mutaxassislar orasidan o'zingizga mosini
              toping
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
              >
                Mutaxassis qidirish
              </Button>
              <Button size="xl" variant="secondary">
                Mutaxassis bo'lish
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
