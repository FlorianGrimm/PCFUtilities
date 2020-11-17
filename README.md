# PCFUtilities

a set of helpers

alpha do not use!



## install
```
```

## Setup for docu

```
mkdir PCFUtilityControls
pac solution init --publisher-name FlorianGrimm --publisher-prefix fgr

mkdir PCFUtilityControls\PCFGuidelines

mkdir PCFUtilitySample
cd PCFUtilitySample
pac solution init --publisher-name FlorianGrimm --publisher-prefix fgr

mkdir PCFUtilityControlSample
cd PCFUtilityControlSample
pac pcf init --namespace PCFUtilitySample --name  PCFUtilityControlSample --template field
npm install

mkdir PCFUtilityFieldSample
cd PCFUtilityFieldSample
pac pcf init --namespace PCFUtilitySample --name  PCFUtilityFieldSample --template field
npm install

mkdir PCFUtilityDatasetSample
cd PCFUtilityDatasetSample
pac pcf init --namespace PCFUtilitySample --name  PCFUtilityDatasetSample --template dataset
npm install

mkdir library
cd library
npm install typescript@^3.9.7 @types/powerapps-component-framework@^1.2.0 --save-dev
npm install @types/jest@^26.0.15 ts-jest@^26.4.4 power-assert@^1.6.1 jest@^26.6.3 espower-typescript@^9.0.2 canvas@^2.5.0 --save-dev

```
