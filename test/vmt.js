/* Example definition of a simple mode that understands a subset of
 * JavaScript:
 */

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("vmf", function() {

  var TOKEN_NAMES = {
    '+': 'positive',
    '-': 'negative',
    '@': 'meta'
  };

  return {
    token: function(stream) {
      var tw_pos = stream.string.search(/[\t ]+?$/);

      if (!stream.sol() || tw_pos === 0) {
        stream.skipToEnd();
        return ("error " + (
          TOKEN_NAMES[stream.string.charAt(0)] || '')).replace(/ $/, '');
      }

      var token_name = TOKEN_NAMES[stream.peek()] || stream.skipToEnd();

      if (tw_pos === -1) {
        stream.skipToEnd();
      } else {
        stream.pos = tw_pos;
      }

      return token_name;
    }
  };
});

});
// CodeMirror.defineSimpleMode("simplemode", {
//   // The start state contains the rules that are intially used
//   start: [
//     // The regex matches the token, the token property contains the type
//     {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},
//     // You can match multiple tokens at once. Note that the captured
//     // groups must span the whole string in this case
//     {regex: /(function)(\s+)([a-z$][\w$]*)/,
//      token: ["keyword", null, "variable-2"]},
//     // Rules are matched in the order in which they appear, so there is
//     // no ambiguity between this one and the one above
//     {regex: /(?:function|var|return|if|for|while|else|do|this)\b/,
//      token: "keyword"},
//     {regex: /true|false|null|undefined/, token: "atom"},
//     {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
//      token: "number"},
//     {regex: /\/\/.*/, token: "comment"},
//     {regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3"},
//     // A next property will cause the mode to move to a different state
//     {regex: /\/\*/, token: "comment", next: "comment"},
//     {regex: /[-+\/*=<>!]+/, token: "operator"},
//     // indent and dedent properties guide autoindentation
//     {regex: /[\{\[\(]/, indent: true},
//     {regex: /[\}\]\)]/, dedent: true},
//     {regex: /[a-z$][\w$]*/, token: "variable"},
//     // You can embed other modes with the mode property. This rule
//     // causes all code between << and >> to be highlighted with the XML
//     // mode.
//     {regex: /<</, token: "meta", mode: {spec: "xml", end: />>/}}
//   ],
//   // The multi-line comment state.
//   comment: [
//     {regex: /.*?\*\//, token: "comment", next: "start"},
//     {regex: /.*/, token: "comment"}
//   ],
//   // The meta property contains global information about the mode. It
//   // can contain properties like lineComment, which are supported by
//   // all modes, and also directives like dontIndentStates, which are
//   // specific to simple modes.
//   meta: {
//     dontIndentStates: ["comment"],
//     lineComment: "//"
//   }
// });

/*
    <UserLang name="VDF-Material" ext="vmt">
        <Settings>
            <Global caseIgnored="yes" />
            <TreatAsSymbol comment="no" commentLine="yes" />
            <Prefix words1="no" words2="no" words3="no" words4="yes" />
        </Settings>
        <KeywordLists>
            <Keywords name="Delimiters">000000</Keywords>
            <Keywords name="Folder+">{</Keywords>
            <Keywords name="Folder-">}</Keywords>
            <Keywords name="Operators">&quot;</Keywords>
            <Keywords name="Comment">1 1 2 2 0//</Keywords>
            <Keywords name="Words1">alienscale basetimeslightmaptimesdetail basetimeslightmapwet basetimesmod2xenvmap bloom blurfilterx blurfiltery cable camo cloud debugbumpedlightmap debugbumpedvertexlit debugfbtexture debuglightingonly debuglightmap debugluxels debugmodifyvertex debugnormalmap debugunlit debugvertexlit decalmodulate downsample eyeball eyes fillrate gooinglass internalframesync jellyfish jojirium lightmappedgeneric lightmappedtwotexture VolumeClouds modulate overlay_fit particlesphere predator reflecttexture refract shadow shadowbuild shadowmodel showdestalpha skyfog sprite teeth translucentlightmap unlitgeneric unlittwotexture vertexlitgeneric vertexnormals volumetricfog water watersurfacebottom wireframe worldtwotextureblend worldvertexalpha worldvertextransition yuv VertexLitGeneric_HDR_DX9 LightmappedGeneric_HDR_DX9 LightmappedGeneric_DX9 LightmappedGeneric_DX8 VertexLitGeneric_DX9 VertexLitGeneric_dx8 VertexLitGeneric_dx7 VertexLitGeneric_dx6 LightmappedGeneric_dx6 LightmappedGeneric_NoBump_DX8 Proxies Water_HDR_DX90 Water_DX90 Water_DX81 Water_DX80 Water_DX60 ShatteredGlass ShatteredGlass_DX7 BreakableSurface UnlitGeneric_dx9 UnlitGeneric_dx8 UnlitGeneric_dx6 Refract_dx90 Refract_dx80 Refract_dx60 ShatteredGlass_dx8 WorldTwoTextureBlend_dx8 WorldTwoTextureBlend_dx6 WorldVertexTransition_dx9 WorldVertexTransition_dx8 WorldVertexTransition_dx6 WorldVertexAlpha_dx8 Eyes_dx6 Modulate_dx6 MonitorScreen Predator_dx80 Predator_dx60 Sprite_dx8 Sprite_dx6 UnlitTwoTexture_dx6 WriteZ_dx6 WindowImposter_dx80 WindowImposter_dx60 patch replace sky Spritecard FleshInterior LightmappedReflective WriteZ WindowImposter EyeRefract Eyes_dx8</Keywords>
            <Keywords name="Words2">$basetexture $basetexture3 $surfaceprop $model $bumpmap $phong $phongexponent $halflambert $phongexponenttexture $phongwarptexture $phongboost $phongfresnelranges $selfillum $translucent $vertexcolor $vertexalpha $decal $decalscale $color $writeZ $normalmapalphaenvmapmask $additive $no_fullbright $ignorez $nolod $parallaxmap $parallaxmapscale $basealphaenvmapmask $nodiffusebumplighting $envmap $envmaptint $envmapcontrast $envmapsaturation $basetexturetransform $detail $detailscale $fresnelreflection $nodecal $alpha $envmapmask $nocull $alphatest $surfaceprop2 $basetexture2 $bumpmap2 $abovewater $refracttexture $refracttint $reflecttint $reflectamount $forceexpensive $bottommaterial $bumpframe $fogenable $fogcolor $fogstart $fogend $basetexturetransform2 $lightmaptint $reflectivity $reflecttexture $refractamount $normalmap $fallbackmaterial $forcecheap $scale $envmapmode $envmapmaskscale $bumptransform $texture2 $reflectentities $heightmap $heightscale $heightmapsample sine $frame $selfillumtint $detailblendmode $detailblendfactor $nofog $ssbump $seamless_scale $cheapwaterstartdistance $cheapwaterenddistance $selfillum_envmapmask_alpha $detailframe $hdrcompressedTexture $hdrbasetexture $addself $overbrightfactor $minsize $maxsize $minfadesize $maxfadesize $blendframes $ambientocclusiontexture $phongalbedotint $lightwarptexture $clientshader $selfillummask $FleshInteriorEnabled $FleshInteriorTexture $FleshNormalTexture $FleshBorderTexture1D $FleshInteriorNoiseTexture $FleshSubsurfaceTexture $FleshCubeTexture $FleshBorderNoiseScale $FleshBorderWidth $FleshBorderSoftness $FleshBorderTint $FleshGlossBrightness $FleshDebugForceFleshOn $time $iris $softedges $edgesoftnessstart $edgesoftnessend $scaleedgesoftnessbasedonscreenres $outline $outlinecolor $outlinestart0 $outlinestart1 $outlineend0 $outlineend1 $outlinealpha $scaleoutlinesoftnessbasedonscreenres $glow $glowcolor $glowalpha $glowstart $glowend $glowx $glowy $distancealpha $fresnelpower $minreflectivity $maxreflectivity $spriteorientation $spriteorigin $detailtint $detail_alpha_mask_base_texture $decalfadeduration $decalfadetime $modelmaterial $cloudalphatexture $cloudscale $maskscale $ambientocclusion $corneabumpstrength $parallaxstrength $dilation $ambientocclcolor $eyeballradius $corneatexture $ambientoccltexture $raytracesphere $spheretexkillcombo $phongtint $allowdiffusemodulation $shinybloodexponent $shinyblood $compress $stretch $blendtintbybasealpha $allowalphatocoverage $basemapluminancephongmask $color2 $shaderSrgbRead360 $basemapalphaphongmask $glossiness $envmapmasktransform $crackmaterial $multipass $blendmodulatetexture $receiveflashlight Add Multiply Subtract Divide Equals Abs Frac Exponential Clamp LessOrEqual Sine LinearRamp UniformNoise GaussianNoise MatrixRotate PlayerProximity PlayerView PlayerSpeed PlayerPosition EntitySpeed Empty ToggleTexture RandomEntity CurrentTime PlayerHealth PlayerDamageTime MaterialModify ConveyorScroll LampBeam LampHalo EntityRandom TextureTransform IsNPC TextureScroll WaterLOD AnimatedTexture $vertexcolormodulate $bluramount $forcerefract $startfadesize $endfadesize $depthblend $depthblendscale $addoverblend $maxdistance $farfadeinterval $cloakpassenabled $cloakfactor $cloakcolortint $SSBumpMathFix</Keywords>
            <Keywords name="Words3">%tooltexture %compilepassbullets %keywords %compilewater %detailtype %compileNonSolid %compileBlockLOS %compileNodraw %compileDetail resultVar srcVar1 srcVar2 sineperiod sinemin sinemax %notooltexture insert include %compileNoShadows %compilesky %compilehint %compileskip %compileorigin %compileclip %playerclip %compilenpcclip %compilenochop %compiletrigger %compilenolight %compileplayercontrolclip %compileladder %compilewet %compileinvisible %compileslime %noportal translateVar animatedtexturevar animatedtextureframenumvar animatedtextureframerate texturescrollvar texturescrollrate texturescrollangle rotateVar</Keywords>
            <Keywords name="Words4">srgb hdr? !hdr? ldr? gpu $ &lt; &gt; =</Keywords>
        </KeywordLists>
        <Styles>
            <WordsStyle name="DEFAULT" styleID="11" fgColor="000000" bgColor="FFFFFF" fontName="Consolas" fontStyle="0" />
            <WordsStyle name="FOLDEROPEN" styleID="12" fgColor="0000FF" bgColor="FFFFFF" fontName="" fontStyle="1" />
            <WordsStyle name="FOLDERCLOSE" styleID="13" fgColor="0000FF" bgColor="FFFFFF" fontName="" fontStyle="1" />
            <WordsStyle name="KEYWORD1" styleID="5" fgColor="008000" bgColor="FFFFFF" fontName="" fontStyle="4" />
            <WordsStyle name="KEYWORD2" styleID="6" fgColor="000080" bgColor="FFFFFF" fontName="" fontStyle="1" />
            <WordsStyle name="KEYWORD3" styleID="7" fgColor="804000" bgColor="FFFFFF" fontName="" fontStyle="1" />
            <WordsStyle name="KEYWORD4" styleID="8" fgColor="408080" bgColor="FFFFFF" fontName="" fontStyle="1" />
            <WordsStyle name="COMMENT" styleID="1" fgColor="000000" bgColor="FFFFFF" fontName="" fontStyle="0" />
            <WordsStyle name="COMMENT LINE" styleID="2" fgColor="004040" bgColor="FFFFFF" fontName="" fontStyle="2" />
            <WordsStyle name="NUMBER" styleID="4" fgColor="000000" bgColor="FFFFFF" fontName="" fontStyle="0" />
            <WordsStyle name="OPERATOR" styleID="10" fgColor="804000" bgColor="FFFFFF" fontName="" fontStyle="1" />
            <WordsStyle name="DELIMINER1" styleID="14" fgColor="800000" bgColor="FFFFFF" fontName="" fontStyle="0" />
            <WordsStyle name="DELIMINER2" styleID="15" fgColor="800000" bgColor="FFFFFF" fontName="" fontStyle="0" />
            <WordsStyle name="DELIMINER3" styleID="16" fgColor="000000" bgColor="FFFFFF" fontName="" fontStyle="0" />
        </Styles>
    </UserLang>
*/