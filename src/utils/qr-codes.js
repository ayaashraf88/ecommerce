import  QRCode  from "qrcode";
export  function qrCodeGeneration(data){
const qrCode= QRCode.toDataURL(JSON.stringify(data),{errorDetectionLevel:'M'})
return qrCode
}