import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import { FaShareFromSquare } from "react-icons/fa6";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

const Formateur = () => {
  const [formateurs, setFormateurs] = useState([]);
  const [selectedSecteur, setSelectedSecteur] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);  // État pour afficher le menu de partage

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('./api.json');
      const data = await response.json();
      setFormateurs(data.formateurs);
    };
    fetchData();
  }, []);

  // Filtrer les formateurs selon le secteur sélectionné
  const filteredFormateurs = selectedSecteur
    ? formateurs.filter(formateur => formateur.secteur === selectedSecteur)
    : [];

  // Fonction pour télécharger un tableau en PDF
  const downloadPDF = (formateur) => {
    const doc = new jsPDF();
    doc.text('Formateur: ' + formateur.nom + ' ' + formateur.prenom, 10, 10);
    doc.autoTable({ html: '#table_' + formateur.id });
    doc.save('formateur_' + formateur.id + '.pdf');
  };

  // Fonction pour télécharger un tableau en Excel
  const downloadExcel = (formateur) => {
    const ws = XLSX.utils.table_to_sheet(document.getElementById('table_' + formateur.id));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Formateur');
    XLSX.writeFile(wb, 'formateur_' + formateur.id + '.xlsx');
  };

  return (
    <div className="bg-white text-black font-sans p-4 container mx-auto">
      <h1 className="text-center text-xl font-bold mb-4">FORMATEURS :</h1>

      <div className="mb-4">
        <label htmlFor="secteur" className="block text-sm font-medium text-gray-700">
          Secteur :
        </label>
        <select
          id="secteur"
          name="secteur"
          value={selectedSecteur}
          onChange={(e) => setSelectedSecteur(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-lg border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-100 hover:bg-gray-200 transition-all duration-300 ease-in-out"
        >
          <option value="">-- Sélectionnez un secteur --</option>
          <option value="Digital">Digital</option>
          <option value="Agro-alimentaire">Agro-alimentaire</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      {selectedSecteur === '' ? (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md text-center">
          Veuillez sélectionner un secteur pour afficher les formateurs.
        </div>
      ) : (
        filteredFormateurs.map((formateur) => (
          <div key={formateur.id} className="mb-8">
            <table className="min-w-full bg-white border border-gray-300 mb-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-6 py-3 border-b border-gray-300">{formateur.id}</th>
                  <th className="px-6 py-3 border-b border-gray-300">{formateur.nom}</th>
                  <th className="px-6 py-3 border-b border-gray-300">{formateur.prenom}</th>
                  <th className="px-6 py-3 border-b border-gray-300">{formateur.secteur}</th>
                  <th className="px-6 py-3 border-b border-gray-300">Tableau Service</th>
                  <th className="px-6 py-3 border-b border-gray-300">Emploi</th>
                </tr>
              </thead>
            </table>

            <h2 className="text-lg font-bold mb-2">
              Formateur : {formateur.nom} {formateur.prenom}
            </h2>

            <div className="border border-gray-300 rounded-lg p-4 relative">
              {/* Icône de partage */}
              <FaShareFromSquare 
                onClick={() => setShowShareMenu(!showShareMenu)}  // Affiche/masque le menu de partage
                className="absolute top-4 right-4 text-blue-500 text-4xl cursor-pointer"
              />
              {showShareMenu && (
                <div className="absolute top-12 right-4 bg-white border border-gray-300 shadow-md rounded-md p-2">
                  <button
                    onClick={() => {
                      downloadPDF(formateur);
                      setShowShareMenu(false);  // Masque le menu après l'action
                    }}
                    className="block text-red-500 hover:text-red-700 mb-2"
                  >
                    Télécharger en PDF
                  </button>
                  <button
                    onClick={() => {
                      downloadExcel(formateur);
                      setShowShareMenu(false);  // Masque le menu après l'action
                    }}
                    className="block text-green-500 hover:text-green-700"
                  >
                    Télécharger en Excel
                  </button>
                </div>
              )}
              <table
                id={'table_' + formateur.id}
                className="min-w-full bg-white border border-gray-300 rounded-lg"
              >
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-2 border border-gray-300">Code</th>
                    <th className="px-4 py-2 border border-gray-300">Intitule</th>
                    <th className="px-4 py-2 border border-gray-300">Mh Synthese</th>
                    <th className="px-4 py-2 border border-gray-300">MH P</th>
                    <th className="px-4 py-2 border border-gray-300">MH Total</th>
                  </tr>
                </thead>
                <tbody>
                  {formateur.modules.map((module, index) => (
                    <tr key={index} className="hover:bg-gray-100 transition-all duration-300 ease-in-out">
                      <td className="px-4 py-2 border border-gray-300">{module.code}</td>
                      <td className="px-4 py-2 border border-gray-300">{module.intitule}</td>
                      <td className="px-4 py-2 border border-gray-300">{module.mhSynthese}</td>
                      <td className="px-4 py-2 border border-gray-300">{module.mhP}</td>
                      <td className="px-4 py-2 border border-gray-300">{module.mhTotal}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="px-4 py-2 border-t border-gray-300 text-right font-bold">
                      Total masse horaire :
                    </td>
                    <td className="px-4 py-2 border-t border-gray-300 font-bold">{formateur.totalMasseHoraire}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Formateur;
