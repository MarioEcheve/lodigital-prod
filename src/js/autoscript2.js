function saveSignature() {
	AutoScript.saveDataToFile(
			document.getElementById('result').value,
			"Guardar firma electr\u00F3nica",
			null,
			null,
			null,
			showSaveOkCallback,
			showErrorCallback);
}

function showSaveOkCallback() {
	showLog("Guardado OK");
}

function showSignResultCallback(signatureB64, certificateB64) {
	showLog("Firma OK");
	document.getElementById('result').value = signatureB64;
}

function showCertCallback(certificateB64) {
	showLog("Certificado seleccionado");
	document.getElementById('result').value = certificateB64;
}

function showErrorCallback(errorType, errorMessage) {
	showLog("Type: " + errorType + "\nMessage: " + errorMessage);
}

function doSign(base64) {
	try {				
		var data = base64;
		var imagenqr = "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";
		
		var extra = "layer2Text= Folio emitido por $$SUBJECTCN$$ el $$SIGNDATE=dd/MM/yyyy HH:mm:ss$$ con un certificado emitido por $$ISSUERCN$$\nsignaturePositionOnPageLowerLeftX=85\nsignaturePositionOnPageLowerLeftY=50\nsignaturePositionOnPageUpperRightX=275\nsignaturePositionOnPageUpperRightY=110\nsignaturePage=-1\nlayer2FontSize=10\nlayer2FontColor=darkGray\nimagePage=-1\nimagePositionOnPageLowerLeftX=20\nimagePositionOnPageLowerLeftY=50\nimagePositionOnPageUpperRightX=80\nimagePositionOnPageUpperRightY=110\nimage="+imagenqr+"";

		AutoScript.sign(
			data,
			"SHA512withRSA",
			"Adobe PDF",
			extra,			
			showSignResultCallback,
			showErrorCallback);
		
	} catch(e) {
		try {
			showLog("Type: " + AutoScript.getErrorType() + "\nMessage: " + AutoScript.getErrorMessage());
		} catch(ex) {
			showLog("Error: " + e);
		}
	}
}

function downloadAndSign() {
	try {

		AutoScript.downloadRemoteData(
				document.location,
				downloadedSuccessCallback,
				downloadedErrorCallback);
	} catch(e) {
		showLog("Error en la descarga de los datos: " + e);
	}
}

function downloadedSuccessCallback(data) {
	try {
		AutoScript.sign(
			(data != undefined && data != null && data != "") ? data : null,
			document.getElementById("algorithm").value,
			document.getElementById("format").value,
			document.getElementById("params").value,
			showSignResultCallback,
			showErrorCallback);
	} catch(e) {
		try {
			showLog("Type: " + AutoScript.getErrorType() + "\nMessage: " + AutoScript.getErrorMessage());
		} catch(ex) {
			showLog("Error: " + e);
		}
	}
}

function downloadedErrorCallback(e) {
	showLog("Error en la descarga de los datos: " + e);
}

function doSignBatch() {
	try {
		var batch = createBatchConfiguration();

		AutoScript.signBatch(
			AutoScript.getBase64FromText(batch),
			Constants.URL_BASE_SERVICES + '/afirma-server-triphase-signer/BatchPresigner', //$NON-NLS-1$
			Constants.URL_BASE_SERVICES + '/afirma-server-triphase-signer/BatchPostsigner', //$NON-NLS-1$
			document.getElementById("params").value,
			showSignResultCallback,
			showErrorCallback);

	} catch(e) {
		try {
			showLog("Type: " + AutoScript.getErrorType() + "\nMessage: " + AutoScript.getErrorMessage());
		} catch(ex) {
			showLog("Error: " + e);
		}
	}
}

function createBatchConfiguration() {

	var config1 = AutoScript.getBase64FromText("FileName=C:/salida/batch/FIRMA1.xml");
	var config2 = AutoScript.getBase64FromText("FileName=C:/salida/batch/FIRMA2.xml");

	return "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\r\n" + //$NON-NLS-1$
	"<signbatch stoponerror=\"false\" algorithm=\"SHA256withRSA\">\r\n" + //$NON-NLS-1$
	" <singlesign Id=\"7725374e-728d-4a33-9db9-3a4efea4cead\">\r\n" + //$NON-NLS-1$
	"  <datasource>SG9sYSBNdW5kbw==</datasource>\r\n" + //$NON-NLS-1$
	"  <format>XAdES</format>\r\n" + //$NON-NLS-1$
	"  <suboperation>sign</suboperation>\r\n" + //$NON-NLS-1$
	"  <extraparams>Iw0KI1RodSBBdWcgMTMgMTY6Mjk6MDUgQ0VTVCAyMDE1DQpTaWduYXR1cmVJZD03NzI1Mzc0ZS03MjhkLTRhMzMtOWRiOS0zYTRlZmVhNGNlYWQNCg==</extraparams>\r\n" + //$NON-NLS-1$
	"  <signsaver>\r\n" + //$NON-NLS-1$
	"   <class>es.gob.afirma.signers.batch.SignSaverFile</class>\r\n" + //$NON-NLS-1$
	"   <config>" + config1 + "</config>\r\n" + //$NON-NLS-1$
	"  </signsaver>\r\n" + //$NON-NLS-1$
	" </singlesign>\r\n" + //$NON-NLS-1$
	" <singlesign Id=\"93d1531c-cd32-4c8e-8cc8-1f1cfe66f64a\">\r\n" + //$NON-NLS-1$
	"  <datasource>SG9sYSBNdW5kbw==</datasource>\r\n" + //$NON-NLS-1$
	"  <format>CAdES</format>\r\n" + //$NON-NLS-1$
	"  <suboperation>sign</suboperation>\r\n" + //$NON-NLS-1$
	"  <extraparams>cG9saWN5SWRlbnRpZmllcj11cm46b2lkOjIuMTYuNzI0LjEuMy4xLjEuMi4xLjkKcG9saWN5UXVhbGlmaWVyPWh0dHBzOi8vc2VkZS4wNjAuZ29iLmVzL3BvbGl0aWNhX2RlX2Zpcm1hX2FuZXhvXzEucGRmCnBvbGljeUlkZW50aWZpZXJIYXNoQWxnb3JpdGhtPWh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNzaGExCnBvbGljeUlkZW50aWZpZXJIYXNoPUc3cm91Y2Y2MDArZjAzci9vMGJBT1E2V0FzMD0=</extraparams>\r\n" + //$NON-NLS-1$
	"  <signsaver>\r\n" + //$NON-NLS-1$
	"   <class>es.gob.afirma.signers.batch.SignSaverFile</class>\r\n" + //$NON-NLS-1$
	"   <config>" + config2 + "</config>\r\n" + //$NON-NLS-1$
	"  </signsaver>\r\n" + //$NON-NLS-1$
	" </singlesign>\r\n" + //$NON-NLS-1$
	"</signbatch>"; //$NON-NLS-1$
}

function doCoSign() {
	try {
		var signature = document.getElementById("signature").value;
		var data = document.getElementById("data").value;

		AutoScript.coSign(
			(signature != undefined && signature != null && signature != "") ? signature : null,
			(data != undefined && data != null && data != "") ? data : null,
			document.getElementById("algorithm").value,
			document.getElementById("format").value,
			document.getElementById("params").value,
			showSignResultCallback,
			showErrorCallback);

	} catch(e) {
		showLog("Type: " + AutoScript.getErrorType() + "\nMessage: " + AutoScript.getErrorMessage());
	}
}

function doCounterSign() {
	try {
		var signature = document.getElementById("signature").value;

		AutoScript.counterSign(
			(signature != undefined && signature != null && signature != "") ? signature : null,
			document.getElementById("algorithm").value,
			document.getElementById("format").value,
			document.getElementById("params").value,
			showSignResultCallback,
			showErrorCallback);
	} catch(e) {
		showLog("Type: " + AutoScript.getErrorType() + "\nMessage: " + AutoScript.getErrorMessage());
	}
}

function doSelectCert() {
	try {
		AutoScript.selectCertificate(
			document.getElementById("params").value,
			showCertCallback,
			showErrorCallback);
	} catch(e) {
		showLog("Type: " + AutoScript.getErrorType() + "\nMessage: " + AutoScript.getErrorMessage());
	}
}

function doSignAndSave(cryptoOp) {
	
	try {				
		var data;
		if (cryptoOp == 'sign') {
			data = document.getElementById("data").value;
		}
		else {
			data = document.getElementById("signature").value;
		}

		AutoScript.signAndSaveToFile(
			cryptoOp,
			(data != undefined && data != null && data != "") ? data : null,
			document.getElementById("algorithm").value,
			document.getElementById("format").value,
			document.getElementById("params").value,
			null,
			showSignResultCallback,
			showErrorCallback);

	} catch(e) {
		try {
			showLog("Type: " + AutoScript.getErrorType() + "\nMessage: " + AutoScript.getErrorMessage());
		} catch(ex) {
			showLog("Error: " + e);
		}
	}
}


function showAppletLog() {
	try {
		AutoScript.getCurrentLog(showGetCurrentLogResultCallback,
				showErrorCallback);
	} catch (e) {
		showLog("Type: " + AutoScript.getErrorType() + "\nMessage: "
				+ AutoScript.getErrorMessage());
	}

}

function showGetCurrentLogResultCallback(log) {
	showLog(log)
}


/**
 * Funcion para la carga de un fichero. Almacena el contenido del fichero en un campo oculto y muestra su nombre.
 * LA CARGA INDEPENDIENTE DE FICHEROS DEBE EVITARSE EN LA MEDIDA DE LO POSIBLE, DADO QUE NO ES COMPATIBLE CON EL
 * CLIENTE MOVIL NI CON AUTOFIRMA EN EDGE NI INTERNET EXPLORER 10 O ANTERIORES. Si deseas firmar, cofirmar o
 * contrafirmar un fichero, llama al metodo correspondiente (sign(), coSign() o counterSign()) sin indicar los datos.
 */
function browseDatos(title) {
	try {
		AutoScript.getFileNameContentBase64(
				title,
				null,
				null,
				null,
				showLoadDataResultCallback, showErrorCallback);

	} catch (e) {
		showLog("Type: " + AutoScript.getErrorType() + "\nMessage: "
				+ AutoScript.getErrorMessage());
	}
}

/**
 * Funcion para la carga de un fichero. Almacena el contenido del fichero en un campo oculto y muestra su nombre.
 * LA CARGA INDEPENDIENTE DE FICHEROS DEBE EVITARSE EN LA MEDIDA DE LO POSIBLE. Si deseas firmar, cofirmar o contrafirmar
 * un fichero, llama al metodo correspondiente (sign(), coSign() o counterSign()) sin indicar los datos.
 * El uso del metodo de carga no sera compatible con el Cliente movil.
 */
function browseFirma(title) {
	try {

		AutoScript.getFileNameContentBase64(title, "xsig,pdf,xml,doc",
				"Fichero para prueba de función load",
				"C://Users//jose.rodriguez.gomez//Documents",
				showLoadFirmaResultCallback, showErrorCallback);

	} catch (e) {
		showLog("Type: " + AutoScript.getErrorType() + "\nMessage: "
				+ AutoScript.getErrorMessage());
	}
}

function showLoadDataResultCallback(fileName, dataB64) {

	dataFilename.innerHTML = fileName;
	data.value = dataB64;
}

function showLoadFirmaResultCallback(fileName, dataB64) {

	signatureFilename.innerHTML = fileName;
	signature.value = dataB64;

}

function setStickySignature() {

	var isSticky = document.getElementById("sticky").checked;

	AutoScript.setStickySignatory(isSticky);

}

function cleanDataField(dataField, textDiv) {

	textDiv.innerHTML = "";
	dataField.value = null;
}

function addExtraParam(extraParam) {
	var paramsList = document.getElementById("params");
	paramsList.value = paramsList.value + "\n" + extraParam;
	document.getElementById('newParam').value = "";
}

function cleanExtraParams() {
	document.getElementById("params").value = "";
	document.getElementById('newParam').value = "";
}

function showLog(newLog) {
	document.getElementById('console').value = document
			.getElementById('console').value
			+ "\n" + newLog;
}

// lineas del html 
AutoScript.cargarAppAfirma();
AutoScript.setServlets(Constants.URL_BASE_SERVICES + "/afirma-signature-storage/StorageService", Constants.URL_BASE_SERVICES + "/afirma-signature-retriever/RetrieveService");

// lineas del html 
var paramsElement = document.getElementById("params");
paramsElement.innerHTML = "serverUrl=" + Constants.URL_BASE_SERVICES + "/afirma-server-triphase-signer/SignatureService";

