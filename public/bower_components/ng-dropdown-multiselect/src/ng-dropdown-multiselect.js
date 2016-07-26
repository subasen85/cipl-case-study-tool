(function() {

	'use strict';

	angular.module('ng-dropdown-multiselect', [])

		.directive('ngDropdownMultiselect', ['$filter', '$document', function ($filter, $document) {

      return {
        restrict: 'AE',

        scope: {
          selectedModel: '=',
          options: '=',
          extraSettings: '=',
          events: '=',
          searchFilter: '=?',
          translationTexts: '=',
          groupBy: '@'
        },

        template: function (element, attributes) {
          var groups = attributes.groupBy ? true : false;

          var template =  '<div class="multiselect-parent btn-group dropdown-multiselect" ng-class="{active: open && !settings.alwaysOpened}">';
	            template += '<button type="button" class="dropdown-toggle" ng-class="settings.buttonClasses" ng-click="toggleDropdown()">{{getButtonText()}}&nbsp;<i class="icon-down"></i></button>';
	            template += '<ul class="dropdown-menu dropdown-menu-form" ng-style="{display: (settings.alwaysOpened || open) ? \'block\' : \'none\', height : settings.scrollable ? settings.scrollableHeight : \'auto\' }" style="overflow: scroll" >';
	            template += '<li ng-show="settings.showCheckAll && settings.selectionLimit === 0 && (!settings.toggleCheckAllNone || settings.toggleCheckAllNone && toggleCheckAllNone)"><a data-ng-click="selectAll()"><span class="glyphicon glyphicon-ok"></span>  {{texts.checkAll}}</a>';
	            template += '<li ng-show="settings.showUncheckAll && (!settings.toggleCheckAllNone || settings.toggleCheckAllNone && !toggleCheckAllNone)"><a data-ng-click="deselectAll();"><span class="glyphicon glyphicon-remove"></span>   {{texts.uncheckAll}}</a></li>';
	            template += '<li ng-hide="(!settings.showCheckAll || settings.selectionLimit > 0) && !settings.showUncheckAll || settings.noSeparators" class="divider"></li>';

	            // Search
	            template += '<li ng-show="settings.enableSearch"><div class="dropdown-header"><input type="text" class="form-control" style="width: 100%;" ng-model="searchFilter" placeholder="{{texts.searchPlaceholder}}" /></li>';
	            template += '<li ng-show="settings.enableSearch && !settings.noSeparators" class="divider"></li>';

	            // New item
	            template += '<li ng-show="settings.enableNewItem"><div class="dropdown-header"><input type="text" class="form-control" style="width: 100%;" ng-model="newItem" placeholder="{{texts.newItemPlaceholder}}" ng-keydown="onNewItemAddKeyDown($event)" />';
	            template += '<span class="glyphicon glyphicon-plus icon-plus" ng-hide="settings.hideNewItemButton" ng-click="onNewItemAddClick()"></span></li>';
	            template += '<li ng-show="settings.enableNewItem && !settings.noSeparators" class="divider"></li>';

          if (groups) {
            template += '<li ng-repeat-start="option in orderedItems | filter: searchFilter" ng-show="getPropertyForObject(option, settings.groupBy) !== getPropertyForObject(orderedItems[$index - 1], settings.groupBy)" role="presentation" class="dropdown-header">{{ getGroupTitle(getPropertyForObject(option, settings.groupBy)) }}</li>';
            template += '<li ng-repeat-end role="presentation">';
          } else {
            template += '<li class="presentation" role="presentation" ng-repeat="option in options | filter: searchFilter">';
          }

          // Menu row
          template += '<div class="menu-item" ng-click="setSelectedItem(getPropertyForObject(option,settings.idProp))">';

          // Status (check / uncheck)
          template += '<div class="menu-item-status"><span class="glyphicon" data-ng-class="{\'glyphicon-ok icon-check\': isChecked(getPropertyForObject(option,settings.idProp)), \'glyphicon-remove icon-uncheck\': !isChecked(getPropertyForObject(option,settings.idProp))}"></span></div>';

          // Label
          template += '<div class="menu-item-label" role="menuitem" tabindex="-1">{{getPropertyForObject(option, settings.displayProp)}}</div>';

          // Edit button
          template += '<div class="menu-item-edit" ng-click="showEdit($event)"><span ng-show="settings.enableEditItem" class="glyphicon glyphicon-pencil icon-pencil"></span></div></div>';

          // Edit placeholder
          template += '<div class="edit-item" style="display:none">';
          // Edit input
          template += '<div class="edit-item-input"><input ng-attr-id="getPropertyForObject(option,settings.idProp)" type="text" ng-value="getPropertyForObject(option, settings.displayProp)" ng-keyup="editingOption($event, getPropertyForObject(option,settings.idProp))" /></div>';
          // Edit remove
          template += '<div class="edit-item-remove" ng-click="removeOption($event, getPropertyForObject(option,settings.idProp))"><span class="glyphicon glyphicon-trash icon-trash"</span></div></div>';

          template += '</li>';
          template += '<li class="divider" ng-show="settings.selectionLimit > 1 && !settings.noSeparators"></li>';
          template += '<li role="presentation" ng-show="settings.selectionLimit > 1"><a role="menuitem">{{selectedModel.length}} {{texts.selectionOf}} {{settings.selectionLimit}} {{texts.selectionCount}}</a></li>';
          template += '</ul>';
          template += '</div>';
          
          return template;
        },


        link: function (scope, element, attributes) {

          var dropdownTrigger = element.children()[0];
          var clickHandler;

          scope.toggleDropdown = function () {
              scope.open = !scope.open;
          };

          scope.checkboxClick = function (event, id) {
              scope.setSelectedItem(id);
              event.stopImmediatePropagation();
          };

          scope.showEdit = function (event) {
          	$(event.currentTarget).parent().hide();
          	$(event.currentTarget).parent().next().show();
          };

          scope.editingOption = function (event, id) {
          	if (event.keyCode === 13 || event.keyCode === 27) {
          		$(event.currentTarget).parent().parent().hide();
          		$(event.currentTarget).parent().parent().prev().show();
          		if (event.keyCode === 13) { scope.editOption(id, event.currentTarget.value); }
          		event.stopPropagation();
          	}
          };

          scope.editOption = function (id, value) {
          	_.forEach(scope.options, function (option) {
          		if (option.id === id) { option.label = value; }
          	});
          	if (scope.events.onItemEdit) { scope.events.onItemEdit(id, value); }
          };

          scope.removeOption = function (event, id) {
          	$(event.currentTarget).parent().hide();
          	// Remove from selected options
          	if (scope.settings.selectionLimit === 1 && scope.selectedModel.id === id) {
          		scope.selectedModel = {};
          	}
          	else if (scope.settings.selectionLimit > 1) {
          		scope.selectedModel = scope.selectedModel.filter(function (option) { return option.id !== id; });
          	}
          	// Remove from options
          	scope.options = scope.options.filter(function (option) { return option.id !== id; });
          	// Remove external event
          	if (scope.events.onItemRemove) { scope.events.onItemRemove(id); }
          	event.stopPropagation();
          };

          scope.externalEvents = {
              onItemSelect: angular.noop,
              onItemDeselect: angular.noop,
              onSelectAll: angular.noop,
              onDeselectAll: angular.noop,
              onInitDone: angular.noop,
              onMaxSelectionReached: angular.noop,
              onNewItemAdd: angular.noop,
              onItemEdit: angular.noop,
              onItemRemove: angular.noop
          };

          scope.settings = {
              dynamicTitle: true,
              scrollable: false,
              scrollableHeight: '300px',
              closeOnBlur: true,
              closeOnMouseOut: false,
              displayProp: 'label',
              idProp: 'id',
              externalIdProp: 'id',
              enableSearch: false,
              enableNewItem: false,
              enableEditItem: false,
              alwaysOpened: false,
              noSeparators: false,
              selectionLimit: 0,
              showCheckAll: true,
              showUncheckAll: true,
              closeOnSelect: false,
              buttonClasses: 'btn btn-default',
              closeOnDeselect: false,
              groupBy: attributes.groupBy || undefined,
              groupByTextProvider: null,
              smartButtonMaxItems: 0,
              smartButtonTextConverter: angular.noop,
              toggleCheckAllNone: false
          };

          scope.texts = {
              checkAll: 'Check All',
              uncheckAll: 'Uncheck All',
              selectionCount: 'checked',
              selectionOf: '/',
              searchPlaceholder: 'Search...',
              newItemPlaceholder: 'New item',
              buttonDefaultText: 'Select',
              dynamicButtonTextSuffix: 'checked'
          };

          scope.searchFilter = scope.searchFilter || '';

          scope.$watch('options', function (newValue) {
              if (angular.isDefined(newValue)) {
                  if (angular.isDefined(scope.settings.groupBy)) {
                    scope.orderedItems = $filter('orderBy')(newValue, scope.settings.groupBy);
                  }
                  if (scope.selectedModel.length === scope.options.length) {
                    scope.toggleCheckAllNone = false;
                  }
              }
          });

          angular.extend(scope.settings, scope.extraSettings || []);
          angular.extend(scope.externalEvents, scope.events || []);
          angular.extend(scope.texts, scope.translationTexts);

          scope.singleSelection = scope.settings.selectionLimit === 1;

          scope.toggleCheckAllNone = true;

          function getFindObj(id) {
              var findObj = {};

              if (scope.settings.externalIdProp === '') {
                  findObj[scope.settings.idProp] = id;
              } else {
                  findObj[scope.settings.externalIdProp] = id;
              }

              return findObj;
          }

          function clearObject(object) {
              for (var prop in object) {
                  delete object[prop];
              }
          }

          if (scope.singleSelection) {
              if (angular.isArray(scope.selectedModel) && scope.selectedModel.length === 0) {
                  clearObject(scope.selectedModel);
              }
          }

          if (scope.settings.closeOnMouseOut) {
              $(element).mouseleave(function () {
                  scope.$apply(function () {
                      scope.open = false;
                  });
              });
          }

          if (scope.settings.closeOnBlur && !scope.settings.alwaysOpened) {
              clickHandler = function (e) {
                  if (scope.open) {
                      var target = e.target.parentElement;
                      var parentFound = false;

                      while (angular.isDefined(target) && target !== null && !parentFound) {
                          if (_.contains(target.className.split(' '), 'multiselect-parent') && !parentFound) {
                              if (target === dropdownTrigger) {
                                  parentFound = true;
                              }
                          }
                          target = target.parentElement;
                      }

                      if (!parentFound) {
                          scope.$apply(function () {
                              scope.open = false;
                          });
                      }
                  }
              };
              $document.on('click', clickHandler);
          }

          scope.getGroupTitle = function (groupValue) {
              if (scope.settings.groupByTextProvider !== null) {
                  return scope.settings.groupByTextProvider(groupValue);
              }

              return groupValue;
          };

          scope.getButtonText = function () {
              if (scope.settings.dynamicTitle && angular.isObject(scope.selectedModel) && (scope.selectedModel.length > 0 || _.keys(scope.selectedModel).length > 0)) {
                  if (scope.settings.smartButtonMaxItems > 0) {
                      var itemsText = [];

                      angular.forEach(scope.options, function (optionItem) {
                          if (scope.isChecked(scope.getPropertyForObject(optionItem, scope.settings.idProp))) {
                              var displayText = scope.getPropertyForObject(optionItem, scope.settings.displayProp);
                              var converterResponse = scope.settings.smartButtonTextConverter(displayText, optionItem);

                              itemsText.push(converterResponse ? converterResponse : displayText);
                          }
                      });

                      if (scope.selectedModel.length > scope.settings.smartButtonMaxItems) {
                          itemsText = itemsText.slice(0, scope.settings.smartButtonMaxItems);
                          itemsText.push('...');
                      }

                      return itemsText.join(', ');
                  } else {
                      var totalSelected;

                      if (scope.singleSelection) {
                          totalSelected = (scope.selectedModel !== null && angular.isDefined(scope.selectedModel[scope.settings.idProp])) ? 1 : 0;
                      } else {
                          totalSelected = angular.isDefined(scope.selectedModel) ? scope.selectedModel.length : 0;
                      }

                      if (totalSelected === 0) {
                          return scope.texts.buttonDefaultText;
                      } else {
                          return totalSelected + ' ' + scope.texts.dynamicButtonTextSuffix;
                      }
                  }
              } else {
                  return scope.texts.buttonDefaultText;
              }
          };

          scope.getPropertyForObject = function (object, property) {
              if (angular.isDefined(object) && object.hasOwnProperty(property)) {
                  return object[property];
              }

              return '';
          };

          scope.selectAll = function () {
              scope.deselectAll();
              scope.externalEvents.onSelectAll();

              angular.forEach(scope.options, function (value) {
                  scope.setSelectedItem(value[scope.settings.idProp], true);
              });
              scope.toggleCheckAllNone = false;
          };

          scope.deselectAll = function () {
              scope.externalEvents.onDeselectAll();

              if (scope.singleSelection) {
                  clearObject(scope.selectedModel);
              } else {
                  scope.selectedModel.splice(0, scope.selectedModel.length);
              }
              scope.toggleCheckAllNone = true;
          };

          scope.setSelectedItem = function (id, dontRemove) {
              var findObj = getFindObj(id);
              var finalObj = null;

              if (scope.settings.externalIdProp === '') {
                  finalObj = _.find(scope.options, findObj);
              } else {
                  finalObj = findObj;
              }

              if (scope.singleSelection) {
                  clearObject(scope.selectedModel);
                  angular.extend(scope.selectedModel, finalObj);
                  scope.externalEvents.onItemSelect(finalObj);

                  return;
              }

              dontRemove = dontRemove || false;

              var exists = _.findIndex(scope.selectedModel, findObj) !== -1;

              if (!dontRemove && exists) {
                  scope.selectedModel.splice(_.findIndex(scope.selectedModel, findObj), 1);
                  scope.externalEvents.onItemDeselect(findObj);
                  scope.toggleCheckAllNone = true;
              } else if (!exists && (scope.settings.selectionLimit === 0 || scope.selectedModel.length < scope.settings.selectionLimit)) {
                  scope.selectedModel.push(finalObj);
                  scope.externalEvents.onItemSelect(finalObj);
                  if (scope.selectedModel.length === scope.options.length) { scope.toggleCheckAllNone = false; }
              }
          };

          scope.isChecked = function (id) {
              if (scope.singleSelection) {
                  return scope.selectedModel !== null && angular.isDefined(scope.selectedModel[scope.settings.idProp]) && scope.selectedModel[scope.settings.idProp] === getFindObj(id)[scope.settings.idProp];
              }

              return _.findIndex(scope.selectedModel, getFindObj(id)) !== -1;
          };

          scope.onNewItemAddKeyDown = function (event) {
          	if (event.keyCode === 13) {
          		scope.onNewItemAddClick();
          		event.preventDefault();
          	}
          };
          scope.onNewItemAddClick = function () {
        		scope.events.onNewItemAdd(scope.newItem);
        		scope.newItem = '';
            scope.toggleCheckAllNone = true;
          };

          if (angular.isDefined(scope.options) &&  scope.selectedModel.length === scope.options.length) {
            scope.toggleCheckAllNone = false;
          }

          scope.externalEvents.onInitDone();
          scope.$on('$destroy', function () {
              if (clickHandler) {
                  $document.off('click', clickHandler);
              }
          });

        }
      };
	}]);
})();