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
		AutoScript.sign(
			data,
			"SHA512withRSA",
			"Adobe PDF",
			"layer2Text= Firmado por $$SUBJECTCN$$ el $$SIGNDATE=dd/MM/yyyy HH:mm:ss$$ con un certificado emitido por $$ISSUERCN$$\nsignaturePositionOnPageLowerLeftX=30\nsignaturePositionOnPageLowerLeftY=50\nsignaturePositionOnPageUpperRightX=220\nsignaturePositionOnPageUpperRightY=110\nsignaturePage=-1\nlayer2FontSize=10\nlayer2FontColor=darkGray",			
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

