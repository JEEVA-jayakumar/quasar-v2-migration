<template>
  <div>
    <q-list class="no-padding">
      <q-item
        class="no-padding"
        v-if="Object.keys(propLeadDocumentInformation).length >= 0"
      >
        <q-item-section>
          <div>
            <div v-if="propGetShortInfo.documentUploadedType != 1" class="row items-center full-width">
              <div class="col-md-12 q-body-1">
                <q-expansion-item
                  expand-separator
                  default-opened
                  class="full-width"
                >
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon name="apps" />
                    </q-item-section>
                    <q-item-section class="q-body-1">FORMS</q-item-section>
                  </template>
                  <b><label>Agreement Form & Application Form</label></b>
                  <q-item class="q-body-1">
                    <q-item-section>
                      <div class="full-width">
                        <div
                          class="cursor-pointer"
                          v-if="
                            propGetShortInfo.aggrementFormMimeType.includes(
                              'pdf'
                            )
                          "
                        >
                          <div
                            @click="
                              fnPDFViewModal(propGetShortInfo.aggrementForm)
                            "
                          >
                            <q-btn
                              round
                              size="sm"
                              icon="fas fa-file-pdf"
                              color="primary"
                            />
                            &nbsp;{{ propGetShortInfo.aggrementForm }}
                          </div>
                        </div>
                        <div
                          class="cursor-pointer"
                          v-else-if="
                            propGetShortInfo.aggrementFormMimeType.includes(
                              'image'
                            )
                          "
                        >
                          <div
                            class="hidden"
                          >
                            <img
                              :src="[
                                GLOBAL_FILE_FETCH_URL +
                                  '/' +
                                propGetShortInfo.aggrementForm
                              ]"
                              ref="handedOverImageViewerAgreement"
                              style="max-width:100%"
                            />
                          </div>
                          <div
                            @click="fnViewHandedOverFileImageAgreement()"
                            class="ellipsis"
                          >
                            <q-icon name="fas fa-image" color="amber-9" />
                            &nbsp;{{ propGetShortInfo.aggrementForm }}
                          </div>
                        </div>
                        <div v-else>
                          Invalid document type/ No document available
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>

                  <b><label>Cheque Leaf</label></b>
                  <q-item class="q-body-1">
                    <q-item-section>
                      <div class="full-width">
                        <div
                          class="cursor-pointer"
                          v-if="
                            propGetShortInfo.chequeLeafFormMimeType.includes(
                              'pdf'
                            )
                          "
                        >
                          <div
                            @click="
                              fnPDFViewModal(propGetShortInfo.chequeLeafForm)
                            "
                          >
                            <q-btn
                              round
                              size="sm"
                              icon="fas fa-file-pdf"
                              color="primary"
                            />
                            &nbsp;{{ propGetShortInfo.chequeLeafForm }}
                          </div>
                        </div>
                        <div
                          class="cursor-pointer"
                          v-else-if="
                            propGetShortInfo.chequeLeafFormMimeType.includes(
                              'image'
                            )
                          "
                        >
                          <div
                            class="hidden"
                          >
                            <img
                              :src="[
                                GLOBAL_FILE_FETCH_URL +
                                  '/' +
                                propGetShortInfo.chequeLeafForm
                              ]"
                              ref="handedOverImageViewerCheque"
                              style="max-width:100%"
                            />
                          </div>
                          <div
                            @click="fnViewHandedOverFileImageCheque()"
                            class="ellipsis"
                          >
                            <q-icon name="fas fa-image" color="amber-9" />
                            &nbsp;{{ propGetShortInfo.chequeLeafForm }}
                          </div>
                        </div>
                        <div v-else>
                          Invalid document type/ No document available
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>

                  <b><label>Implementation Form</label></b>
                  <q-item class="q-body-1">
                    <q-item-section>
                      <div class="full-width">
                        <div
                          class="cursor-pointer"
                          v-if="
                            propGetShortInfo.implementationFormMimeType.includes(
                              'pdf'
                            )
                          "
                        >
                          <div
                            @click="
                              fnPDFViewModal(
                                propGetShortInfo.implementationForm
                              )
                            "
                          >
                            <q-btn
                              round
                              size="sm"
                              icon="fas fa-file-pdf"
                              color="primary"
                            />
                            &nbsp;{{ propGetShortInfo.implementationForm }}
                          </div>
                        </div>
                        <div
                          class="cursor-pointer"
                          v-else-if="
                            propGetShortInfo.implementationFormMimeType.includes(
                              'image'
                            )
                          "
                        >
                          <div
                            class="hidden"
                          >
                            <img
                              :src="[
                                GLOBAL_FILE_FETCH_URL +
                                  '/' +
                                propGetShortInfo.implementationForm
                              ]"
                              ref="handedOverImageViewerImplementation"
                              style="max-width:100%"
                            />
                          </div>
                          <div
                            @click="fnViewHandedOverFileImageImplementation()"
                            class="ellipsis"
                          >
                            <q-icon name="fas fa-image" color="amber-9" />
                            &nbsp;{{ propGetShortInfo.implementationForm }}
                          </div>
                        </div>
                        <div v-else>
                          Invalid document type/ No document available
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>

                  <b><label>Picture of Shop</label></b>
                  <q-item class="q-body-1">
                    <q-item-section>
                      <div class="full-width">
                        <div
                          class="cursor-pointer"
                          v-if="
                            propGetShortInfo.pictureOfShopMimeType.includes(
                              'pdf'
                            )
                          "
                        >
                          <div
                            @click="
                              fnPDFViewModal(propGetShortInfo.pictureOfShop)
                            "
                          >
                            <q-btn
                              round
                              size="sm"
                              icon="fas fa-file-pdf"
                              color="primary"
                            />
                            &nbsp;{{ propGetShortInfo.pictureOfShop }}
                          </div>
                        </div>
                        <div
                          class="cursor-pointer"
                          v-else-if="
                            propGetShortInfo.pictureOfShopMimeType.includes(
                              'image'
                            )
                          "
                        >
                          <div
                            class="hidden"
                          >
                            <img
                              :src="[
                                GLOBAL_FILE_FETCH_URL +
                                  '/' +
                                propGetShortInfo.pictureOfShop
                              ]"
                              ref="handedOverImageViewerPicture"
                              style="max-width:100%"
                            />
                          </div>
                          <div
                            @click="fnViewHandedOverFileImagePicture()"
                            class="ellipsis"
                          >
                            <q-icon name="fas fa-image" color="amber-9" />
                            &nbsp;{{ propGetShortInfo.pictureOfShop }}
                          </div>
                        </div>
                        <div v-else>
                          Invalid document type/ No document available
                        </div>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-expansion-item>
              </div>
            </div>

            <div v-if="propGetShortInfo.documentUploadedType == 1">
              <q-item
                class="q-body-1 text-dark bg-grey-4 text-weight-medium"
              >
                <q-item-section>Agreement Form & Application Form</q-item-section>
                <q-item-section side>
                  <label
                    class="cursor-pointer text-white"
                    style="background-color: #202c3f;"
                  >
                    <span class="q-caption text-weight-light">Attach</span>
                    <input
                      type="file"
                      name="file"
                      @change="fnVerificationDocumentUploadFormsUpload($event, 'Agreement')"
                      accept=".png, .jpg, .pdf"
                    />
                  </label>
                </q-item-section>
              </q-item>
              <q-item class="q-body-1">
                <q-item-section>
                  <div class="full-width">
                    <div class="cursor-pointer" v-if="isAgreementPdf">
                      <div
                        @click="fnPDFViewModal(propGetShortInfo.aggrementForm)"
                        class="ellipsis"
                      >
                        <q-btn
                          round
                          size="sm"
                          icon="fas fa-file-pdf"
                          color="primary"
                        />
                        &nbsp;{{ propGetShortInfo.aggrementForm }}
                      </div>
                    </div>
                    <div class="cursor-pointer" v-else-if="isAgreementImage">
                      <div class="hidden">
                        <img
                          :src="agreementImageSource"
                          ref="handedOverImageViewerAgreement"
                          style="max-width:100%"
                        />
                      </div>
                      <div
                        @click="fnViewHandedOverFileImageAgreement()"
                        class="ellipsis"
                      >
                        <q-icon name="fas fa-image" color="amber-9" />
                        &nbsp;{{ propGetShortInfo.aggrementForm }}
                      </div>
                    </div>
                    <div v-else>
                      No document available
                    </div>
                  </div>
                </q-item-section>
              </q-item>

              <q-item
                class="q-body-1 text-dark bg-grey-4 text-weight-medium"
              >
                <q-item-section>Cheque Leaf</q-item-section>
                <q-item-section side>
                  <label
                    id="attach"
                    class="cursor-pointer text-white"
                    style="background-color: #202c3f;"
                  >
                    <span class="q-caption text-weight-light">Attach</span>
                    <input
                      type="file"
                      name="file"
                      @change="fnVerificationDocumentUploadFormsUpload($event, 'ChequeleaforBankstatement')"
                      accept=".png, .jpg, .pdf"
                    />
                  </label>
                </q-item-section>
              </q-item>
              <q-item class="q-body-1">
                <q-item-section>
                  <div class="full-width">
                    <div class="cursor-pointer" v-if="isChequeLeafPdf">
                      <div
                        @click="fnPDFViewModal(propGetShortInfo.chequeLeafForm)"
                        class="ellipsis"
                      >
                        <q-btn
                          round
                          size="sm"
                          icon="fas fa-file-pdf"
                          color="primary"
                        />
                        &nbsp;{{ propGetShortInfo.chequeLeafForm }}
                      </div>
                    </div>
                    <div class="cursor-pointer" v-else-if="isChequeLeafImage">
                      <div class="hidden">
                        <img
                          :src="chequeLeafImageSource"
                          ref="handedOverImageViewerCheque"
                          style="max-width:100%"
                        />
                      </div>
                      <div
                        @click="fnViewHandedOverFileImageCheque()"
                        class="ellipsis"
                      >
                        <q-icon name="fas fa-image" color="amber-9" />
                        &nbsp;{{ propGetShortInfo.chequeLeafForm }}
                      </div>
                    </div>
                    <div v-else>
                      No document available
                    </div>
                  </div>
                </q-item-section>
              </q-item>

              <q-item
                class="q-body-1 text-dark bg-grey-4 text-weight-medium"
              >
                <q-item-section>Implementation Form</q-item-section>
                <q-item-section side>
                  <label
                    id="attach"
                    class="cursor-pointer text-white"
                    style="background-color: #202c3f;"
                  >
                    <span class="q-caption text-weight-light">Attach</span>
                    <input
                      type="file"
                      name="file"
                      @change="fnVerificationDocumentUploadFormsUpload($event,'ImplementationForm')"
                      accept=".png, .jpg, .pdf"
                    />
                  </label>
                </q-item-section>
              </q-item>
              <q-item class="q-body-1">
                <q-item-section>
                  <div class="full-width">
                    <div class="cursor-pointer" v-if="isImplementationPdf">
                      <div
                        @click="fnPDFViewModal(propGetShortInfo.implementationForm)"
                        class="ellipsis"
                      >
                        <q-btn
                          round
                          size="sm"
                          icon="fas fa-file-pdf"
                          color="primary"
                        />
                        &nbsp;{{ propGetShortInfo.implementationForm }}
                      </div>
                    </div>
                    <div class="cursor-pointer" v-else-if="isImplementationImage">
                      <div class="hidden">
                        <img
                          :src="implementationImageSource"
                          ref="handedOverImageViewerImplementation"
                          style="max-width:100%"
                        />
                      </div>
                      <div
                        @click="fnViewHandedOverFileImageImplementation()"
                        class="ellipsis"
                      >
                        <q-icon name="fas fa-image" color="amber-9" />
                        &nbsp;{{ propGetShortInfo.implementationForm }}
                      </div>
                    </div>
                    <div v-else>
                      No document available
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              
              <q-item
                class="q-body-1 text-dark bg-grey-4 text-weight-medium">
                <q-item-section>Picture of Shop</q-item-section>
                <q-item-section side>
                  <label
                    id="attach"
                    class="cursor-pointer text-white"
                    style="background-color: #202c3f;"
                  >
                    <span class="q-caption text-weight-light">Attach</span>
                    <input
                      type="file"
                      name="file"
                      @change="fnVerificationDocumentUploadFormsUpload($event, 'PhotoofShop')"
                      accept=".png, .jpg, .pdf"
                    />
                  </label>
                </q-item-section>
              </q-item>
              <q-item class="q-body-1">
                <q-item-section>
                  <div class="full-width">
                    <div class="cursor-pointer" v-if="isPictureOfShopPdf">
                      <div
                        @click="fnPDFViewModal(propGetShortInfo.pictureOfShop)"
                        class="ellipsis"
                      >
                        <q-btn
                          round
                          size="sm"
                          icon="fas fa-file-pdf"
                          color="primary"
                        />
                        &nbsp;{{ propGetShortInfo.pictureOfShop }}
                      </div>
                    </div>
                    <div class="cursor-pointer" v-else-if="isPictureOfShopImage">
                      <div class="hidden">
                        <img
                          :src="pictureOfShopImageSource"
                          ref="handedOverImageViewerPicture"
                          style="max-width:100%"
                        />
                      </div>
                      <div
                        @click="fnViewHandedOverFileImagePicture()"
                        class="ellipsis"
                      >
                        <q-icon name="fas fa-image" color="amber-9" />
                        &nbsp;{{ propGetShortInfo.pictureOfShop }}
                      </div>
                    </div>
                    <div v-else>
                      No document available
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </div>

            <div v-if="propGetShortInfo.documentUploadedType != null && propGetShortInfo.qrLeadCategory == false">
              <div
                v-if="propGetShortInfo.documentUploadedType != 1 && propGetShortInfo.qrLeadCategory == false"
                class="row items-center full-width"
              >
                <div class="col-md-12 q-body-1">
                  <q-expansion-item
                    expand-separator
                    default-opened
                    class="full-width"
                  >
                    <template v-slot:header>
                      <q-item-section avatar>
                        <q-icon name="apps" />
                      </q-item-section>
                      <q-item-section
                        class="q-body-1"
                      >
                        {{ propLeadDocumentInformation.length + 'Type(s)' }}
                      </q-item-section>
                    </template>
                    <div
                      class="row items-center full-width"
                      v-for="(subDocument,
                      subIndex) in propLeadDocumentInformation"
                      :key="subIndex"
                    >
                      <div class="col-md-12 q-body-1">
                        <q-expansion-item
                          expand-separator
                          class="full-width"
                        >
                          <template v-slot:header>
                            <q-item-section
                              class="q-body-1"
                            >
                              <div>{{ subDocument.subDocumentType }}</div>
                              <div>{{ subDocument.uploadedDocuments.length + 'Document(s)' }}</div>
                            </q-item-section>
                            <q-item-section
                              side
                              v-if="
                                [2, 4].includes(
                                  subDocument.documentVerifiedStatus
                                )
                              "
                            >
                              <q-btn
                                round
                                size="xs"
                                class="q-ma-xs"
                                color="green"
                                icon="fas fa-check"
                                @click.stop="
                                  fnDocumentApproveModal(subDocument)
                                "
                              />
                              <q-btn
                                round
                                size="xs"
                                class="q-ma-xs"
                                color="red"
                                icon="fas fa-times"
                                @click.stop="fnDocumentRejectModal(subDocument)"
                              />
                              <q-btn
                                round
                                size="xs"
                                class="q-ma-xs"
                                color="primary"
                                icon="fas fa-plus"
                                @click.stop="fileUploadForUsingMerchantId(subDocument.merchantDocumentType)"
                              />
                            </q-item-section>
                            <q-item-section side v-else>
                              <span
                                v-if="subDocument.documentVerifiedStatus == 1"
                                class="q-body-1 text-weight-medium text-positive"
                                >Approved</span
                              >
                              <span
                                v-if="subDocument.documentVerifiedStatus == 3"
                                class="q-body-1 text-weight-medium text-negative"
                                >Rejected</span
                              >
                              <div v-if="propGetShortInfo.qrLeadStatus == 9">
                                <q-btn
                                  round
                                  size="xs"
                                  class="q-ma-xs"
                                  color="green"
                                  icon="fas fa-check"
                                  @click.stop="
                                    fnDocumentApproveModal(subDocument)
                                  "
                                />
                                <q-btn
                                  round
                                  size="xs"
                                  class="q-ma-xs"
                                  color="red"
                                  icon="fas fa-times"
                                  @click.stop="
                                    fnDocumentRejectModal(subDocument)
                                  "
                                />
                              </div>
                            </q-item-section>
                          </template>
                          <div v-if="subDocument.uploadedDocuments.length > 0">
                            <div
                              v-for="(item,
                              subIndex) in subDocument.uploadedDocuments"
                              :key="subIndex"
                              class="q-py-sm cursor-pointer"
                            >
                              <div v-if="item.mimeType.includes('application')">
                                <div
                                  @click="fnPDFViewModal(item.fileName)"
                                  class="ellipsis"
                                >
                                  <q-btn
                                    round
                                    size="sm"
                                    icon="fas fa-file-pdf"
                                    color="primary"
                                  />
                                  &nbsp;{{ item.fileName }}
                                </div>
                              </div>
                              <div
                                v-else-if="item.mimeType.includes('image')"
                                class="q-pa-md"
                              >
                                <div>
                                  <img
                                    :src="
                                      GLOBAL_FILE_FETCH_URL + '/' + item.fileName
                                    "
                                    style="max-width:100%"
                                  />
                                </div>
                              </div>
                              <div v-else class="full-width">
                                Invalid document type/ No document available
                              </div>
                            </div>
                          </div>
                          <div v-else>No document available</div>
                        </q-expansion-item>
                      </div>
                    </div>
                  </q-expansion-item>
                </div>
              </div>

              <div v-if="propGetShortInfo.documentUploadedType != 2">
                <div
                  class="group"
                  v-if="
                    this.propGetShortInfo.qrMerchantType.merchantTypeName ==
                      'Sole Proprietorship' ||
                      this.propGetShortInfo.qrMerchantType.merchantTypeName ==
                        'Individuals'
                  "
                >
                  <q-list
                    class="no-padding"
                    dense
                    v-for="(singleDocument,
                    singleDocumentIndex) in filteredSingleDocumentsQr"
                    :key="singleDocumentIndex"
                  >
                    <div
                      v-for="(document,
                      documentIndex) in singleDocument.documents"
                      :key="documentIndex"
                      class="border-bottom"
                    >
                      <q-item
                        dense
                        class="q-body-1 bg-grey-4 q-pa-sm"
                      >
                        <q-item-section>
                          {{ document.subDocumentType }}
                        </q-item-section>
                        <q-item-section side>
                          <label
                            id="attach"
                            class="cursor-pointer text-white"
                            style="background-color: #202c3f;"
                          >
                            <span class="q-caption text-weight-light"
                              >Attach</span
                            >
                            <input
                              type="file"
                              name="file"
                              @change="
                                fnVerificationDocumentUploadSingleUpload(
                                  $event,
                                  document
                                )
                              "
                              accept=".png, .jpg, .pdf"
                            />
                          </label>
                        </q-item-section>
                      </q-item>
                      <!-- {{ document.documentType }}    {{ displayAttachedFileIndex }}  -->

                      <div
                        v-for="(displayAttachedFile,
                        displayAttachedFileIndex) in filteredDocsByDocumentType(document.documentType)"
                        :key="displayAttachedFileIndex"
                      >
                        <div
                          v-for="attachedSubFile in filteredDisplayAttachedFileBySubDocumentType(displayAttachedFile, document.subDocumentType)"
                          :key="attachedSubFile.id"
                        >
                          <q-item
                            dense
                            v-for="(filesAttachedEarlier,
                            filesAttachedEarlierIndex) in attachedSubFile.uploadedDocuments"
                            :key="filesAttachedEarlierIndex"
                            class="q-body-1"
                          >
                            <q-item-section>
                              <div
                                class="cursor-pointer"
                                v-if="
                                  filesAttachedEarlier.mimeType.includes(
                                    'pdf'
                                  )
                                "
                              >
                                <div
                                  ref="attachedImageViewer"
                                  @click="
                                    fnPDFViewModal(
                                      filesAttachedEarlier.fileName
                                    )
                                  "
                                  class="ellipsis"
                                >
                                  <q-icon
                                    name="fas fa-file-pdf"
                                    color="negative"
                                  />
                                  &nbsp;{{ filesAttachedEarlier.fileName }}
                                </div>
                              </div>
                              <div
                                class="cursor-pointer"
                                v-else-if="
                                  filesAttachedEarlier.mimeType.includes(
                                    'image'
                                  )
                                "
                              >
                                <div class="hidden">
                                  <img
                                    :src="[
                                      GLOBAL_FILE_FETCH_URL +
                                        '/' +
                                      filesAttachedEarlier.fileName
                                    ]"
                                    ref="attachedImageViewer"
                                    style="max-width:100%"
                                  />
                                </div>
                                <div
                                  @click="
                                    fnViewAttachedFileImage(
                                      filesAttachedEarlierIndex
                                    )
                                  "
                                  class="ellipsis"
                                >
                                  <q-icon
                                    name="fas fa-image"
                                    color="amber-9"
                                  />
                                  &nbsp;{{ filesAttachedEarlier.fileName }}
                                </div>
                              </div>
                            </q-item-section>

                            <q-item-section side>
                              <q-btn
                                size="xs"
                                icon="clear"
                                @click="
                                  fnDeleteAlreadyAttachedFile(
                                    filesAttachedEarlier
                                  )
                                "
                                round
                                color="negative"
                                label="Remove"
                              />
                            </q-item-section>
                          </q-item>
                        </div>
                      </div>
                    </div>
                  </q-list>

                  <div>
                    <q-list
                      class="no-padding"
                      dense
                      v-for="multipleDocument in filteredMultipleDocumentsQr"
                      :key="multipleDocument.id"
                    >
                      <q-item-label
                        class="q-mb-sm bg-grey-4"
                        >{{ multipleDocument.documentType }}
                      </q-item-label>
                      <div>
                        <q-item dense class="q-body-1 q-pa-sm">
                          <q-item-section>
                            <select
                              class="full-width customQuasarSelect"
                              v-model="
                                multipleDocument.subDocumentTypeSelection
                              "
                              @change="
                                fnGetSubDocuments(
                                  multipleDocument.subDocumentTypeSelection
                                )
                              "
                            >
                              <option disabled value="0"
                                >Choose from below</option
                              >
                              <option
                                v-for="type in filteredMultipleDocumentDocuments(multipleDocument.documents)"
                                :key="type.id"
                                :value="type"
                                >{{ type.subDocumentType }}
                              </option>
                            </select>
                          </q-item-section>
                          <q-item-section
                            side
                            v-if="
                              fn_________GetEntryPermissionToUploadSubDocuments(
                                multipleDocument
                              )
                            "
                            ref="subDocumentUploadParent"
                          >
                            <label
                              id="attach"
                              class="cursor-pointer text-white"
                              style="background-color: #202c3f;"
                            >
                              <span class="q-caption text-weight-light"
                                >Attach</span
                              >
                              <input
                                type="file"
                                ref="subDocumentUpload"
                                @change="
                                  fnVerificationDocumentUpload(
                                    $event,
                                    multipleDocument.subDocumentTypeSelection
                                  )
                                "
                                name="file"
                                accept=".png, .jpg, .pdf"
                              />
                            </label>
                          </q-item-section>
                        </q-item>
                      </div>
                      <q-separator />

                      <div
                        v-for="(displayAttachedFile,
                        displayAttachedFileIndex) in filteredDocsByMultipleDocumentType(multipleDocument.documentType)"
                        :key="displayAttachedFileIndex"
                      >
                        <div
                          v-for="attachedSubFile in displayAttachedFile"
                          :key="attachedSubFile.id"
                        >
                          <q-item
                            v-for="(filesAttachedEarlier,
                            filesAttachedEarlierIndex) in attachedSubFile.uploadedDocuments"
                            :key="filesAttachedEarlierIndex"
                            class="q-body-1"
                            dense
                          >
                            <q-item-section>
                              <div
                                class="cursor-pointer"
                                v-if="
                                  filesAttachedEarlier.mimeType.includes(
                                    'pdf'
                                  )
                                "
                              >
                                <div
                                  ref="multiAttachedImageViewer"
                                  @click="
                                    fnPDFViewModal(
                                      filesAttachedEarlier.fileName
                                    )
                                  "
                                  class="ellipsis"
                                >
                                  <q-icon
                                    name="fas fa-file-pdf"
                                    color="negative"
                                  />
                                  &nbsp;{{ filesAttachedEarlier.fileName }}
                                </div>
                              </div>
                              <div
                                class="cursor-pointer"
                                v-else-if="
                                  filesAttachedEarlier.mimeType.includes(
                                    'image'
                                  )
                                "
                              >
                                <div class="hidden">
                                  <img
                                    :src="[
                                      GLOBAL_FILE_FETCH_URL +
                                        '/' +
                                      filesAttachedEarlier.fileName
                                    ]"
                                    ref="multiAttachedImageViewer"
                                    style="max-width:100%"
                                  />
                                </div>
                                <div
                                  @click="
                                    fnViewMultiAttachedFileImage(
                                      filesAttachedEarlierIndex
                                    )
                                  "
                                  class="ellipsis"
                                >
                                  <q-icon
                                    name="fas fa-image"
                                    color="amber-9"
                                  />
                                  &nbsp;{{ filesAttachedEarlier.fileName }}
                                </div>
                              </div>
                            </q-item-section>
                            <q-item-section side>
                              <q-btn
                                size="xs"
                                icon="clear"
                                @click="
                                  fnDeleteAlreadyAttachedFile(
                                    filesAttachedEarlier
                                  )
                                "
                                round
                                color="negative"
                                label="Remove"
                              />
                            </q-item-section>
                          </q-item>
                          <q-separator />
                        </div>
                      </div>
                    </q-list>
                  </div>
                </div>

                <div class="group" v-else>
                  <q-list
                    class="no-padding"
                    dense
                    v-for="(singleDocument,
                    singleDocumentIndex) in filteredSingleDocumentsNonQr"
                    :key="singleDocumentIndex"
                  >
                    <div
                      v-for="(document,
                      documentIndex) in singleDocument.documents"
                      :key="documentIndex"
                      class="border-bottom"
                    >
                      <q-item
                        dense
                        class="q-body-1 bg-grey-4 q-pa-sm"
                      >
                        <q-item-section>
                          {{ document.subDocumentType }}
                        </q-item-section>

                        <q-item-section side>
                          <label
                            id="attach"
                            class="cursor-pointer text-white"
                            style="background-color: #202c3f;"
                          >
                            <span class="q-caption text-weight-light"
                              >Attach</span
                            >
                            <input
                              type="file"
                              name="file"
                              @change="
                                fnVerificationDocumentUploadSingleUpload(
                                  $event,
                                  document
                                )
                              "
                              accept=".png, .jpg, .pdf"
                            />
                          </label>
                        </q-item-section>
                      </q-item>

                      <div
                        v-for="(displayAttachedFile,
                        displayAttachedFileIndex) in filteredDocsByDocumentType(document.documentType)"
                        :key="displayAttachedFileIndex"
                      >
                        <div
                          v-for="attachedSubFile in filteredDisplayAttachedFileBySubDocumentType(displayAttachedFile, document.subDocumentType)"
                          :key="attachedSubFile.id"
                        >
                          <q-item
                            dense
                            v-for="(filesAttachedEarlier,
                            filesAttachedEarlierIndex) in attachedSubFile.uploadedDocuments"
                            :key="filesAttachedEarlierIndex"
                            class="q-body-1"
                          >
                            <q-item-section>
                              <div
                                class="cursor-pointer"
                                v-if="
                                  filesAttachedEarlier.mimeType.includes(
                                    'pdf'
                                  )
                                "
                              >
                                <div
                                  ref="attachedImageViewer"
                                  @click="
                                    fnPDFViewModal(
                                      filesAttachedEarlier.fileName
                                    )
                                  "
                                  class="ellipsis"
                                >
                                  <q-icon
                                    name="fas fa-file-pdf"
                                    color="negative"
                                  />
                                  &nbsp;{{ filesAttachedEarlier.fileName }}
                                </div>
                              </div>
                              <div
                                class="cursor-pointer"
                                v-else-if="
                                  filesAttachedEarlier.mimeType.includes(
                                    'image'
                                  )
                                "
                              >
                                <div class="hidden">
                                  <img
                                    :src="[
                                      GLOBAL_FILE_FETCH_URL +
                                        '/' +
                                      filesAttachedEarlier.fileName
                                    ]"
                                    ref="attachedImageViewer"
                                    style="max-width:100%"
                                  />
                                </div>
                                <div
                                  @click="
                                    fnViewAttachedFileImage(
                                      filesAttachedEarlierIndex
                                    )
                                  "
                                  class="ellipsis"
                                >
                                  <q-icon
                                    name="fas fa-image"
                                    color="amber-9"
                                  />
                                  &nbsp;{{ filesAttachedEarlier.fileName }}
                                </div>
                              </div>
                            </q-item-section>

                            <q-item-section side>
                              <q-btn
                                size="xs"
                                icon="clear"
                                @click="
                                  fnDeleteAlreadyAttachedFile(
                                    filesAttachedEarlier
                                  )
                                "
                                round
                                color="negative"
                                label="Remove"
                              />
                            </q-item-section>
                          </q-item>
                        </div>
                      </div>
                    </div>
                  </q-list>
                  <div>
                    <q-list
                      class="no-padding"
                      dense
                      v-for="multipleDocument in filteredMultipleDocumentsNonQr"
                      :key="multipleDocument.id"
                    >
                      <q-item-label
                        class="q-mb-sm bg-grey-4"
                      >
                        {{ multipleDocument.documentType }}
                      </q-item-label>
                      <div>
                        <q-item dense class="q-body-1 q-pa-sm">
                          <q-item-section>
                            <select
                              class="full-width customQuasarSelect"
                              v-model="
                                multipleDocument.subDocumentTypeSelection
                              "
                              @change="
                                fnGetSubDocuments(
                                  multipleDocument.subDocumentTypeSelection
                                )
                              "
                            >
                              <option disabled value="0"
                                >Choose from below</option
                              >
                              <option
                                v-for="type in filteredMultipleDocumentDocumentsNonQr(multipleDocument.documents)"
                                :key="type.id"
                                :value="type"
                              >
                                {{ type.subDocumentType }}
                              </option>
                            </select>
                          </q-item-section>
                          <q-item-section
                            side
                            v-if="
                              fn_________GetEntryPermissionToUploadSubDocuments(
                                multipleDocument
                              )
                            "
                            ref="subDocumentUploadParent"
                          >
                            <label
                              id="attach"
                              class="cursor-pointer text-white"
                              style="background-color: #202c3f;"
                            >
                              <span class="q-caption text-weight-light"
                                >Attach</span
                              >
                              <input
                                type="file"
                                ref="subDocumentUpload"
                                @change="
                                  fnVerificationDocumentUpload(
                                    $event,
                                    multipleDocument.subDocumentTypeSelection
                                  )
                                "
                                name="file"
                                accept=".png, .jpg, .pdf"
                              />
                            </label>
                          </q-item-section>
                        </q-item>
                      </div>
                      <q-separator />

                      <div
                        v-for="(displayAttachedFile,
                        displayAttachedFileIndex) in filteredDocsByMultipleDocumentType(multipleDocument.documentType)"
                        :key="displayAttachedFileIndex"
                      >
                        <div
                          v-for="attachedSubFile in displayAttachedFile"
                          :key="attachedSubFile.id"
                        >
                          <q-item
                            v-for="(filesAttachedEarlier,
                            filesAttachedEarlierIndex) in attachedSubFile.uploadedDocuments"
                            :key="filesAttachedEarlierIndex"
                            class="q-body-1"
                            dense
                          >
                            <q-item-section>
                              <div
                                class="cursor-pointer"
                                v-if="
                                  filesAttachedEarlier.mimeType.includes(
                                    'pdf'
                                  )
                                "
                              >
                                <div
                                  ref="multiAttachedImageViewer"
                                  @click="
                                    fnPDFViewModal(
                                      filesAttachedEarlier.fileName
                                    )
                                  "
                                  class="ellipsis"
                                >
                                  <q-icon
                                    name="fas fa-file-pdf"
                                    color="negative"
                                  />
                                  &nbsp;{{ filesAttachedEarlier.fileName }}
                                </div>
                              </div>
                              <div
                                class="cursor-pointer"
                                v-else-if="
                                  filesAttachedEarlier.mimeType.includes(
                                    'image'
                                  )
                                "
                              >
                                <div class="hidden">
                                  <img
                                    :src="[
                                      GLOBAL_FILE_FETCH_URL +
                                        '/' +
                                      filesAttachedEarlier.fileName
                                    ]"
                                    ref="multiAttachedImageViewer"
                                    style="max-width:100%"
                                  />
                                </div>
                                <div
                                  @click="
                                    fnViewMultiAttachedFileImage(
                                      filesAttachedEarlierIndex
                                    )
                                  "
                                  class="ellipsis"
                                >
                                  <q-icon
                                    name="fas fa-image"
                                    color="amber-9"
                                  />
                                  &nbsp;{{ filesAttachedEarlier.fileName }}
                                </div>
                              </div>
                            </q-item-section>
                            <q-item-section side>
                              <q-btn
                                size="xs"
                                icon="clear"
                                @click="
                                  fnDeleteAlreadyAttachedFile(
                                    filesAttachedEarlier
                                  )
                                "
                                round
                                color="negative"
                                label="Remove"
                              />
                            </q-item-section>
                          </q-item>
                          <q-separator />
                        </div>
                      </div>
                    </q-list>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <input
            type="file"
            ref="fileUpload"
            class="hidden"
            accept=".jpg, .png, .pdf"
            @change="uploadFile($event,subDocumentTypeId)"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <showQrPdfModalComponent
      v-if="toggleshowPDFModal"
      :propToggleshowPDFModal="toggleshowPDFModal"
      :propPDFDetails="PDFDetails"
      @togglePDFModal="fnPDFViewModal"
    ></showQrPdfModalComponent>
    <showDocumentQrLeadApproveComponent
      v-if="toggleLeadDocumentApproveModal"
      :propToggleDocumentApproveModal="toggleLeadDocumentApproveModal"
      :propDocumentDetails="documentApproveTempArr"
      @toggleDocumentModal="fnDocumentApproveModalAfterEmit"
    ></showDocumentQrLeadApproveComponent>
    <showDocumentQrLeadRejectComponent
      v-if="toggleLeadDocumentRejectModal"
      :propToggleDocumentRejectModal="toggleLeadDocumentRejectModal"
      :propDocumentDetails="documentRejectTempArr"
      @toggleDocumentModal="fnDocumentRejectModalAfterEmit"
    ></showDocumentQrLeadRejectComponent>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import _ from 'lodash'
import showQrPdfModalComponent from "../../components/sat/showQrPdfModalComponent.vue";
import showDocumentQrLeadApproveComponent from "../../components/sat/showDocumentQrLeadApproveComponent.vue";
import showDocumentQrLeadRejectComponent from "../../components/sat/showDocumentQrLeadRejectComponent.vue";

const $q = useQuasar()
const route = useRoute()
const store = useStore()

const props = defineProps({
  propLeadDocumentInformation: {
    type: Object,
    default: () => ({})
  },
  propGetShortInfo: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits([
  'emitTriggerComponentHotLoad',
  'emitAjaxLoadShortLeadInfo'
])

// Refs
const subDocumentTypeId = ref('')
const PDFDetails = ref(null)
const toggleshowPDFModal = ref(false)
const toggleLeadDocumentApproveModal = ref(false)
const toggleLeadDocumentRejectModal = ref(false)
const documentApproveTempArr = ref([])
const documentRejectTempArr = ref([])
const Docs = ref({})
const documents = reactive({
  forSingleDocument: [],
  forMutipleDocument: []
})

const formData = reactive({
  shortLead: props.propGetShortInfo.qrMerchantType?.merchantTypeName || '',
  documentType: []
})

const merchantTypeSelection = computed(() => props.propGetShortInfo.qrMerchantType?.merchantTypeName || '')

// Refs for file upload
const fileUpload = ref(null)
const attachedImageViewer = ref([])
const multiAttachedImageViewer = ref([])
const handedOverImageViewerAgreement = ref(null)
const handedOverImageViewerCheque = ref(null)
const handedOverImageViewerImplementation = ref(null)
const handedOverImageViewerPicture = ref(null)

// Computed properties
const GLOBAL_FILE_FETCH_URL = computed(() => store.getters['GlobalVariables/GLOBAL_FILE_FETCH_URL'])
const getQrShortLeadInfoDocumentTypes = computed(() => store.getters['SatLeadValidation/getQrShortLeadInfoDocumentTypes'])

// Filtered computed properties for v-for with v-if
const filteredSingleDocumentsQr = computed(() => {
  return documents.forSingleDocument.filter(singleDocument => 
    getQrShortLeadInfoDocumentTypes.value && singleDocument.isQr != 0
  )
})

const filteredMultipleDocumentsQr = computed(() => {
  return documents.forMutipleDocument.filter(multipleDocument => 
    getQrShortLeadInfoDocumentTypes.value && multipleDocument.isQr != 0
  )
})

const filteredSingleDocumentsNonQr = computed(() => {
  return documents.forSingleDocument.filter(singleDocument => 
    getQrShortLeadInfoDocumentTypes.value && singleDocument.isQr != 1
  )
})

const filteredMultipleDocumentsNonQr = computed(() => {
  return documents.forMutipleDocument.filter(multipleDocument => 
    getQrShortLeadInfoDocumentTypes.value && multipleDocument.isQr != 1
  )
})

const filteredMultipleDocumentDocuments = computed(() => {
  return (documentsList) => {
    return documentsList.filter(type => type.isQr != 0)
  }
})

const filteredMultipleDocumentDocumentsNonQr = computed(() => {
  return (documentsList) => {
    return documentsList.filter(type => type.isQr != 1)
  }
})

// Helper methods for filtered Docs
const filteredDocsByDocumentType = (documentType) => {
  if (!Docs.value || !Docs.value[documentType]) return []
  return Docs.value[documentType] ? [Docs.value[documentType]] : []
}

const filteredDocsByMultipleDocumentType = (documentType) => {
  if (!Docs.value || !Docs.value[documentType]) return []
  return Docs.value[documentType] ? [Docs.value[documentType]] : []
}

const filteredDisplayAttachedFileBySubDocumentType = (displayAttachedFile, subDocumentType) => {
  if (!displayAttachedFile || !Array.isArray(displayAttachedFile)) return []
  return displayAttachedFile.filter(attachedSubFile => 
    attachedSubFile.subDocumentType === subDocumentType
  )
}

// Image/PDF check computed properties
const isAgreementPdf = computed(() => {
  return props.propGetShortInfo.aggrementFormMimeType?.includes('pdf')
})

const isAgreementImage = computed(() => {
  return props.propGetShortInfo.aggrementFormMimeType?.includes('image')
})

const agreementImageSource = computed(() => {
  return `${GLOBAL_FILE_FETCH_URL.value}/${props.propGetShortInfo.aggrementForm}`
})

const isChequeLeafPdf = computed(() => {
  return props.propGetShortInfo.chequeLeafFormMimeType?.includes('pdf')
})

const isChequeLeafImage = computed(() => {
  return props.propGetShortInfo.chequeLeafFormMimeType?.includes('image')
})

const chequeLeafImageSource = computed(() => {
  return `${GLOBAL_FILE_FETCH_URL.value}/${props.propGetShortInfo.chequeLeafForm}`
})

const isImplementationPdf = computed(() => {
  return props.propGetShortInfo.implementationFormMimeType?.includes('pdf')
})

const isImplementationImage = computed(() => {
  return props.propGetShortInfo.implementationFormMimeType?.includes('image')
})

const implementationImageSource = computed(() => {
  return `${GLOBAL_FILE_FETCH_URL.value}/${props.propGetShortInfo.implementationForm}`
})

const isPictureOfShopPdf = computed(() => {
  return props.propGetShortInfo.pictureOfShopMimeType?.includes('pdf')
})

const isPictureOfShopImage = computed(() => {
  return props.propGetShortInfo.pictureOfShopMimeType?.includes('image')
})

const pictureOfShopImageSource = computed(() => {
  return `${GLOBAL_FILE_FETCH_URL.value}/${props.propGetShortInfo.pictureOfShop}`
})

// Methods
const fnViewHandedOverFileImageAgreement = () => {
  if (handedOverImageViewerAgreement.value) {
    handedOverImageViewerAgreement.value.click()
  }
}

const fnViewHandedOverFileImageCheque = () => {
  if (handedOverImageViewerCheque.value) {
    handedOverImageViewerCheque.value.click()
  }
}

const fnViewHandedOverFileImageImplementation = () => {
  if (handedOverImageViewerImplementation.value) {
    handedOverImageViewerImplementation.value.click()
  }
}

const fnViewHandedOverFileImagePicture = () => {
  if (handedOverImageViewerPicture.value) {
    handedOverImageViewerPicture.value.click()
  }
}

const fnViewAttachedFileImage = (index) => {
  if (attachedImageViewer.value[index]) {
    attachedImageViewer.value[index].click()
  }
}

const fnViewMultiAttachedFileImage = (index) => {
  if (multiAttachedImageViewer.value[index]) {
    multiAttachedImageViewer.value[index].click()
  }
}

const setGroup = () => {
  if (props.propGetShortInfo.qrLeadDocuments) {
    const groupDocuments = _.groupBy(
      props.propGetShortInfo.qrLeadDocuments,
      (document) => document.documentType
    )
    Docs.value = groupDocuments
  }
}

const fnPDFViewModal = (documentUrl) => {
  PDFDetails.value = documentUrl
  toggleshowPDFModal.value = !toggleshowPDFModal.value
}

const fnDocumentApproveModal = (documentDetails) => {
  toggleLeadDocumentApproveModal.value = !toggleLeadDocumentApproveModal.value
  documentDetails.leadId = route.params.id
  documentApproveTempArr.value = documentDetails
}

const fnDocumentApproveModalAfterEmit = (leadId) => {
  toggleLeadDocumentApproveModal.value = !toggleLeadDocumentApproveModal.value
  emit('emitTriggerComponentHotLoad', leadId)
}

const fnDocumentRejectModalAfterEmit = (leadId) => {
  toggleLeadDocumentRejectModal.value = !toggleLeadDocumentRejectModal.value
  emit('emitTriggerComponentHotLoad', leadId)
}

const fnDocumentRejectModal = (documentDetails) => {
  toggleLeadDocumentRejectModal.value = !toggleLeadDocumentRejectModal.value
  documentDetails.leadId = route.params.id
  documentRejectTempArr.value = documentDetails
}

const ajaxLoadShortLeadInfoForDocumentTypes = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching files .."
  })
  
  try {
    await store.dispatch('SatLeadValidation/FETCH_LEAD_DOCUMENT_TYPE_DATA_QR')
    await fnGetMerchantTypeValue(props.propGetShortInfo.qrMerchantType?.merchantTypeName)
    formData.documentType = getQrShortLeadInfoDocumentTypes.value
    
    emit('emitAjaxLoadShortLeadInfo', 'hotReloadForDocumentsUploadValidation', merchantTypeSelection.value)
    $q.loading.hide()
  } catch {

    $q.loading.hide()
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Failed to fetch document types",
      icon: "thumb_down"
    })
  }
}

const fnGetMerchantTypeValue = (inputvalue) => {
  if (!inputvalue || !getQrShortLeadInfoDocumentTypes.value) return
  
  const merchantDocumentCategory = _.find(
    getQrShortLeadInfoDocumentTypes.value,
    o => o.merchantType === inputvalue
  )
  
  if (!merchantDocumentCategory) return
  
  const arr = {
    forSingleDocument: [],
    forMutipleDocument: []
  }
  
  const multipleDocs = []
  
  // Calculate mcc value
  const mccCode = props.propGetShortInfo.merchantIndustry?.mccCode
  let mccValue = 5 // default
  
  if (mccCode === "0763") {
    mccValue = 1
  } else if (mccCode === "5813" || mccCode === "5921") {
    mccValue = 2
  } else if (mccCode === "5122" || mccCode === "5912") {
    mccValue = 3
  } else if (["8011", "8021", "8031", "8042", "8049"].includes(mccCode)) {
    mccValue = 4
  }
  
  merchantDocumentCategory.documentsApplicable.forEach((value) => {
    if (value.viewType == 1) {
      arr.forSingleDocument.push(value)
    } else {
      if (Docs.value && Object.prototype.hasOwnProperty.call(Docs.value, value.documentType)) {
        const assumeArr = _.find(value.documents, (oo) => {
          if (Object.prototype.hasOwnProperty.call(Docs.value, oo.documentType) &&
              Docs.value[oo.documentType] &&
              Docs.value[oo.documentType][0] &&
              (oo.subDocumentType == Docs.value[oo.documentType][0].subDocumentType ||
               Docs.value[oo.documentType][0].documentType == Docs.value[oo.documentType][0].subDocumentType)) {
            return oo.documentType
          }
        })
        
        if (assumeArr == undefined) {
          value.subDocumentTypeSelection = 0
        } else {
          value.subDocumentTypeSelection = assumeArr
        }
      } else {
        value.subDocumentTypeSelection = 0
      }
      multipleDocs.push(value)
    }
  })
  
  if (mccValue != 5 && inputvalue !== "Individuals" && inputvalue !== "Sole Proprietorship") {
    const data = multipleDocs.find(obj => obj.documentType === "Company Proof")
    const filteredMultipleDocs = multipleDocs.filter(obj => obj.documentType !== "Company Proof")
    
    if (data) {
      data.documents = data.documents.filter(obj => obj.isMcc == mccValue)
    }
    multipleDocs.length = 0
    multipleDocs.push(...filteredMultipleDocs)
    if (data) multipleDocs.push(data)
  }
  
  arr.forMutipleDocument.push(...multipleDocs)
  Object.assign(documents, arr)
}

const getFormTypeToUpdate = (fileName) => {
  const lowerFileName = fileName.toLowerCase()
  if (lowerFileName.includes("agreement")) {
    return "aggrementForm"
  } else if (lowerFileName.includes("chequeleaforbankstatement")) {
    return "chequeLeafForm"
  } else if (lowerFileName.includes("implementationform")) {
    return "implementationForm"
  } else if (lowerFileName.includes("photoofshop")) {
    return "pictureOfShop"
  }
  return null
}

const fnVerificationDocumentUploadFormsUpload = async (event, formType) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Uploading file .."
  })
  
  try {
    const fileName = `${route.params.id}_${formType}`
    const formData = new FormData()
    formData.append("file", event.target.files[0])
    formData.append("fileNameOriginal", fileName)
    
    const requestParams = {
      files: formData,
      fileNameOriginal: fileName
    }
    
    const response = await store.dispatch('SatLeadValidation/FEED_HAND_OVER_TO_SAT_FORMS_QR_DOCUMENT', requestParams)
    const { fileName: responseFileName, mimeType } = response
    
    setGroup()
    emit('emitAjaxLoadShortLeadInfo', 'hotReloadForDocumentsUploadValidation', merchantTypeSelection.value)
    $q.loading.hide()
    
    const formTypeToUpdate = getFormTypeToUpdate(responseFileName)
    if (formTypeToUpdate) {
      await saveformsLists(responseFileName, mimeType, formTypeToUpdate)
    }
  } catch {

    $q.loading.hide()
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Failed to upload document",
      icon: "thumb_down"
    })
  }
}

const saveformsLists = async (fileName, mimeType, formTypeToUpdate) => {
  $q.loading.show()
  
  const param = {
    data1: {
      id: props.propGetShortInfo.id,
    },
    formsList: {
      [formTypeToUpdate]: fileName,
      [`${formTypeToUpdate}MimeType`]: mimeType
    },
  }
  
  try {
    await store.dispatch('iciciStaticQr/FORMS_UPLOADED_DOCUMENT_QR_DETAILS', param)
    $q.loading.hide()
    $q.notify({
      color: "positive",
      position: "bottom",
      message: "Successfully Updated!",
      icon: "thumb_up"
    })
    await ajaxQrLoadShortLeadInfo()
  } catch (err) {

    $q.loading.hide()
    $q.notify({
      color: "negative",
      position: "bottom",
      message: err.body?.message || "Please Try Again Later !",
      icon: "thumb_down"
    })
  }
}

const fnVerificationDocumentUploadSingleUpload = async (event, documentDetails) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Uploading file .."
  })
  
  try {
    const formData = new FormData()
    formData.append("file", event.target.files[0])
    
    const requestParams = {
      files: formData,
      leadId: route.params.id,
      documentId: documentDetails.id
    }
    
    await store.dispatch('SatLeadValidation/FEED_HAND_OVER_TO_SAT_QR_DOCUMENT', requestParams)
    setGroup()
    emit('emitAjaxLoadShortLeadInfo', 'hotReloadForDocumentsUploadValidation', merchantTypeSelection.value)
    await ajaxQrLoadShortLeadInfo()
    $q.loading.hide()
  } catch {

    $q.loading.hide()
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Failed to upload document",
      icon: "thumb_down"
    })
  }
}

const fn_________GetEntryPermissionToUploadSubDocuments = (multipleDocument) => {
  return multipleDocument?.subDocumentTypeSelection?.selectedSubDocumentType !== undefined
}

const fnVerificationDocumentUpload = async (event, documentDetails) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Uploading file .."
  })
  
  try {
    const formData = new FormData()
    formData.append("file", event.target.files[0])
    
    const requestParams = {
      files: formData,
      leadId: route.params.id,
      documentId: documentDetails.id
    }
    
    await store.dispatch('SatLeadValidation/FEED_HAND_OVER_TO_SAT_QR_DOCUMENT', requestParams)
    $q.loading.hide()
    emit('emitAjaxLoadShortLeadInfo', 'hotReloadForDocumentsUploadValidation', merchantTypeSelection.value)
    await ajaxQrLoadShortLeadInfo()
    setGroup()
  } catch {

    $q.loading.hide()
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Failed to upload document",
      icon: "thumb_down"
    })
  }
}

const fnGetSubDocuments = (documentDetails) => {
  if (documentDetails && !documentDetails.selectedSubDocumentType) {
    documentDetails.selectedSubDocumentType = documentDetails.subDocumentType
  }
}

const ajaxQrLoadShortLeadInfo = async () => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Fetching data .."
  })
  
  try {
    const response = await store.dispatch('iciciStaticQr/FETCH_STATIC_QR_SHORT_LEAD_DATA', route.params.id)
    if (response.data?.data?.qrLeadDocuments) {
      const groupDocuments = _.groupBy(
        response.data.data.qrLeadDocuments,
        (document) => document.documentType
      )
      Docs.value = groupDocuments
    }
    $q.loading.hide()
  } catch {

    $q.loading.hide()
  }
}

const fnDeleteAlreadyAttachedFile = async (documentDetails) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure want to delete uploaded document?",
    ok: {
      label: "Continue",
      color: "primary"
    },
    cancel: {
      label: "Cancel",
      color: "negative",
      flat: true
    }
  }).then(async () => {
    $q.loading.show({
      delay: 0,
      spinnerColor: "purple-9",
      message: "Processing .."
    })
    
    try {
      await store.dispatch('SatLeadValidation/DELETE_DOCUMENT_FROM_BY_SAT', documentDetails)
      $q.notify({
        color: "positive",
        position: "bottom",
        message: "Successfully removed!",
        icon: "thumb_up"
      })
      await ajaxQrLoadShortLeadInfo()
      $q.loading.hide()
    } catch (err) {

      $q.loading.hide()
      $q.notify({
        color: "negative",
        position: "bottom",
        message: err.body?.message || "Please Try Again Later !",
        icon: "thumb_down"
      })
    }
  }).catch(() => {
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "No changes made!",
      icon: "thumb_down"
    })
  })
}

const fileUploadForUsingMerchantId = (details) => {
  subDocumentTypeId.value = details
  if (fileUpload.value) {
    fileUpload.value.click()
  }
}

const uploadFile = async (evt, details) => {
  $q.loading.show({
    delay: 0,
    spinnerColor: "purple-9",
    message: "Uploading file .."
  })
  
  try {
    const formData = new FormData()
    formData.append("file", evt.target.files[0])
    
    const requestParams = {
      files: formData,
      leadId: route.params.id,
      documentId: details
    }
    
    await store.dispatch('SatLeadValidation/FEED_HAND_OVER_TO_SAT_QR_DOCUMENT', requestParams)
    emit('emitTriggerComponentHotLoad')
    evt.target.value = ""
    $q.loading.hide()
  } catch {

    evt.target.value = ""
    $q.loading.hide()
    $q.notify({
      color: "negative",
      position: "bottom",
      message: "Failed to upload document",
      icon: "thumb_down"
    })
  }
}

// Lifecycle hooks
onMounted(() => {
  ajaxLoadShortLeadInfoForDocumentTypes()
  ajaxQrLoadShortLeadInfo()
  setGroup()
})
</script>

<style scoped>
#attach {
  height: 33px;
}
.customQuasarSelect {
  padding: 5px;
  height: 33px;
}

label {
  padding: 5px 10px;
  display: table;
}

input[type="file"] {
  display: none;
}
.bg-dark-custom {
  background: rgba(0, 0, 0, 0.5);
}
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
</style>