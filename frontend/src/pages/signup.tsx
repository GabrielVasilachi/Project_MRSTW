import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../public/images/Logo.svg";

type PersonType = "individual" | "business";

export default function SignupPage() {
  const [type, setType] = useState<PersonType>("individual");

  const [formData, setFormData] = useState({
    individual: {
      firstName: "",
      lastName: "",
      idnp: "",
      idCardSeries: "",
      homeAddress: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    business: {
      companyName: "",
      idno: "",
      legalAddress: "",
      vatCode: "",
      administratorName: "",
      brockerName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [name]: value,
      },
    }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-slate-100 flex items-center justify-center">
            <img src={Logo} className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-semibold text-slate-800">Înregistrare</h1>
          <p className="text-sm text-slate-500">Creați un cont nou pentru a accesa Portal Vamal</p>
        </div>

        <div className="mt-6">
          <div className="bg-slate-100 rounded-md p-1 flex items-stretch">
            <button
              onClick={() => setType("individual")}
              className={`flex-1 px-4 py-2 text-sm rounded-md cursor-pointer ${type === "individual" ? "bg-white shadow-sm" : "bg-transparent text-slate-600"}`}
            >
              Persoană fizică
            </button>
            <button
              onClick={() => setType("business")}
              className={`flex-1 px-4 py-2 text-sm rounded-md cursor-pointer ${type === "business" ? "bg-white shadow-sm" : "bg-transparent text-slate-600"}`}
            >
              Persoană juridică
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {type === "individual" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Nume</label>
                    <input
                    name="firstName"
                    value={formData.individual.firstName}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                    placeholder="Alexei"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Prenume</label>
                    <input
                      name="lastName"
                      value={formData.individual.lastName}
                      onChange={handleInputChange}
                      className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                      placeholder="Ivan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">IDNP</label>
                  <input
                    name="idnp"
                    value={formData.individual.idnp}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                    placeholder="1234567890123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Seria buletinului</label>
                  <input
                    name="idCardSeries"
                    value={formData.individual.idCardSeries}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                    placeholder="B12345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Adresa de domiciliu</label>
                  <input
                    name="homeAddress"
                    value={formData.individual.homeAddress}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                    placeholder="str. Mihai Eminescu, nr. 123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Telefon</label>
                  <input
                    name="phoneNumber"
                    value={formData.individual.phoneNumber}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                    placeholder="+373 6X XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Poșta e-mail</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.individual.email}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                    placeholder="exemplu@email.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Parola</label>
                    <input
                      name="password"
                      type="password"
                      value={formData.individual.password}
                      onChange={handleInputChange}
                      className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                      placeholder="Minim 8 caractere"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Confirmă parola</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={formData.individual.confirmPassword}
                      onChange={handleInputChange}
                      className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Denumirea companiei</label>
                  <input
                    name="companyName"
                    value={formData.business.companyName}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                    placeholder="SRL InfoDev"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">IDNO</label>
                  <input
                    name="idno"
                    value={formData.business.idno}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                    placeholder="1234567890123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Adresa juridică</label>
                  <input
                    name="legalAddress"
                    value={formData.business.legalAddress}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                    placeholder="str. Mihai Eminescu, nr. 69"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Cod TVA (opțional)</label>
                  <input
                    name="vatCode"
                    value={formData.business.vatCode}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                    placeholder="dacă este plătitor TVA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Datele administratorului </label>
                  <input
                    name="administratorName"
                    value={formData.business.administratorName}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                    placeholder="Chetrean Oleg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Brocker</label>
                  <input
                    name="brockerName"
                    value={formData.business.brockerName}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                    placeholder="Ivanov Ion"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Telefon</label>
                  <input
                    name="phone"
                    value={formData.business.phone}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                    placeholder="+373 22 XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Poșta e-mail</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.business.email}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                    placeholder="contact@companie.md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Parola</label>
                    <input
                      name="password"
                      type="password"
                      value={formData.business.password}
                      onChange={handleInputChange}
                      className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                      placeholder="Minim 8 caractere"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Confirmă parola</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={formData.business.confirmPassword}
                      onChange={handleInputChange}
                      className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-md"
                    />
                  </div>
                </div>
              </>
            )}

            <button
            className="mt-4 w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 rounded-md cursor-pointer">Creează cont
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-600">
            Aveți deja cont? <Link to="/login" className="text-sky-600 hover:underline">Autentificați-vă</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

