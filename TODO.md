# TODO

* Create node workspace
* Use [Sharp](https://sharp.pixelplumbing.com/) node module for resizing and output to buffer
* Have a vtf to png function
* Rely on `vtf_info.js`

* Learn [vtf formatting](https://developer.valvesoftware.com/wiki/Valve_Texture_Format)

* Use object for options `vtfconv(imgBuffer,{OPTIONS...})`
  * [Resize](https://sharp.pixelplumbing.com/api-resize)
    * Width
    * Height (Optional)
    * Fit (Optional)
    * Interpolation
  * VTFOptions
      * Version
      * Format
      * Flags
  * More options
