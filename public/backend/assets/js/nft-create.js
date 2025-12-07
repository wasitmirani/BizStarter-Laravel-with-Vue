(function () {
  "use strict";

  /* filepond */
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageExifOrientation,
    FilePondPluginFileValidateSize,
    FilePondPluginFileEncode,
    FilePondPluginImageEdit,
    FilePondPluginFileValidateType,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
  );

  /* single upload */
  FilePond.create(document.querySelector(".single-fileupload"), {
    labelIdle: `Png, Gif, MP4 (or) MP3, WEBP, 3D Model <span class="filepond--label-action">Browse</span>`,
    imagePreviewHeight: 170,
    imageCropAspectRatio: "1:1",
    imageResizeTargetWidth: 200,
    imageResizeTargetHeight: 200,
    stylePanelLayout: "compact circle",
    styleLoadIndicatorPosition: "center bottom",
    styleButtonRemoveItemPosition: "center bottom",
  });

  /* passing unique values */
  var textUniqueVals = new Choices('#nft-tags', {
    allowHTML: true,
    paste: false,
    duplicateItemsAllowed: false,
    editItems: true,
  });
  
})();
