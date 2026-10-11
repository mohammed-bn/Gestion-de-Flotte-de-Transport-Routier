
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateOrdreMission = async (mission) => {
  const pdfDirectory = path.join(__dirname, '../../uploads/pdfs');


  await fs.promises.mkdir(pdfDirectory, { recursive: true });

  const fileName = `ordre-mission-${mission._id}.pdf`;
  const filePath = path.join(pdfDirectory, fileName);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    stream.on('error', reject);
    doc.on('error', reject);

    stream.on('finish', () => {
      resolve({
        fileName,
        filePath,
        pdfUrl: `/uploads/pdfs/${fileName}`
      });
    });

    doc.pipe(stream);


    doc.fontSize(20)
      .text('ORDRE DE MISSION', { align: 'center' });

    doc.moveDown();
    doc.fontSize(12);


    doc.text(`Reference : ${mission._id}`);
    doc.text(`Statut : ${mission.status || 'Non defini'}`);

    if (mission.startDateTime) {
      doc.text(
        `Date de debut : ${new Date(mission.startDateTime).toLocaleString('fr-FR')}`
      );
    }

    if (mission.endDateTime) {
      doc.text(
        `Date de fin : ${new Date(mission.endDateTime).toLocaleString('fr-FR')}`
      );
    }

    if (mission.departureLocation) {
      doc.text(`Depart : ${mission.departureLocation}`);
    }

    if (mission.arrivalLocation) {
      doc.text(`Destination : ${mission.arrivalLocation}`);
    }

    doc.moveDown();
    doc.fontSize(14).text('INFORMATIONS DU CHAUFFEUR');
    doc.moveDown(0.5);
    doc.fontSize(12);

    if (mission.chauffeur) {
      const chauffeur = mission.chauffeur;

      doc.text( `Nom : ${chauffeur.firstName || ''} ${chauffeur.lastName || ''}`);

      if (chauffeur.phone) {doc.text(`Telephone : ${chauffeur.phone}`);}

      if (chauffeur.drivingLicenseNumber) {
        doc.text(`Permis : ${chauffeur.drivingLicenseNumber}`);
      }
    }

    doc.moveDown();
    doc.fontSize(14).text('INFORMATIONS DU CAMION');
    doc.moveDown(0.5);
    doc.fontSize(12);

    if (mission.camion) {
      doc.text(
        `Immatriculation : ${mission.camion.registrationNumber || 'N/A'}`
      );
      doc.text(`Marque : ${mission.camion.brand || 'N/A'}`);
      doc.text(`Modele : ${mission.camion.model || 'N/A'}`);

      if (mission.camion.mileage != null) {
        doc.text(`Kilometrage : ${mission.camion.mileage} km`);
      }
    }


    doc.moveDown();
    doc.fontSize(14).text('INFORMATIONS DE LA REMORQUE');
    doc.moveDown(0.5);
    doc.fontSize(12);

    if (mission.remorque) {
      doc.text(
        `Immatriculation : ${mission.remorque.registrationNumber || 'N/A'}`
      );
      doc.text(`Type : ${mission.remorque.type || 'N/A'}`);

      if (mission.remorque.maxLoad != null) {
        doc.text(`Charge maximale : ${mission.remorque.maxLoad}`);
      }
    }

   
    doc.moveDown(3);
    doc.text('Signature du responsable', 60, doc.y);
    doc.text('Signature du chauffeur', 350, doc.y);

    doc.end();
  });
};