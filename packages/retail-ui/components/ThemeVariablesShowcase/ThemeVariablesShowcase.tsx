import * as React from 'react';
import styles from './ThemeVariablesShowcase.less';
import defaultVariables from '../../lib/theming/themes/DefaultTheme';
import flatVariables from '../../lib/theming/themes/FlatTheme';
import { ITheme } from '../../lib/theming/Theme';
import ComboBox, { ComboBoxItem } from '../ComboBox';
import Gapped from '../Gapped';
import Link from '../Link';
import Sticky from '../Sticky';
import ColorFunctions from '../../lib/styles/ColorFunctions';
import Tooltip from '../Tooltip';
import { PopupPosition } from '../Popup';
import {
  ALL_USED_VARIABLES,
  DIRECTLY_USED_VARIABLES,
  COMPONENT_DESCRIPTIONS,
  COMPONENT_DESCRIPTIONS_BY_VARIABLE,
  EXECUTION_TIME,
  ComponentDescriptionType,
  ComponentRowDescriptionType,
} from './VariablesCollector';

const CSS_TOOLTIP_ALLOWED_POSITIONS: PopupPosition[] = ['bottom left', 'top left'];

const ALL_VARIABLES = Object.keys(defaultVariables)
  .concat(Object.keys(flatVariables))
  .filter((variable, index, all) => all.indexOf(variable) === index);

interface ShowcaseProps {
  isDebugMode?: boolean;
}
interface ShowcaseState {
  selectedVariable?: ComboBoxItem;
}

export default class ThemeVariablesShowcase extends React.Component<ShowcaseProps, ShowcaseState> {
  public state: ShowcaseState = {};

  private isUnmounting = false;
  private variablesDiff: string[] = [];

  public componentWillMount(): void {
    if (this.props.isDebugMode) {
      ALL_VARIABLES.forEach(variable => {
        const found = ALL_USED_VARIABLES.includes(variable);
        if (!found) {
          this.variablesDiff.push(variable);
        }
      });
    }
  }

  public render() {
    const selectedVariable = this.state.selectedVariable;
    const descriptionsToRender = selectedVariable
      ? COMPONENT_DESCRIPTIONS_BY_VARIABLE[selectedVariable.value] || {}
      : COMPONENT_DESCRIPTIONS;

    const isDebugMode = this.props.isDebugMode;
    const executionTime = isDebugMode ? `Сгенерировано за ${EXECUTION_TIME.toFixed(3)}ms` : '';

    return (
      <Gapped gap={30} vertical={false} verticalAlign={'top'}>
        <div>
          <Sticky side={'top'}>
            <div className={styles.searchBar} data-execution-time={executionTime}>
              <Gapped gap={15} vertical={false}>
                <ComboBox
                  getItems={this.getItems}
                  value={selectedVariable}
                  onChange={this.handleVariableChange}
                  onUnexpectedInput={this.handleUnexpectedVariableInput}
                  placeholder={'поиск по названию переменной'}
                />
                {!!selectedVariable && <Link onClick={this.resetVariable}>сбросить</Link>}
              </Gapped>
            </div>
          </Sticky>
          {Object.keys(descriptionsToRender)
            .sort()
            .map(componentName => (
              <ComponentShowcase
                key={componentName}
                name={componentName}
                description={descriptionsToRender[componentName]}
                isDebugMode={isDebugMode}
                onVariableSelect={this.handleVariableChange}
              />
            ))}
        </div>
        <ShowUnusedVariables diff={this.variablesDiff} />
      </Gapped>
    );
  }
  public componentWillUnmount(): void {
    this.isUnmounting = true;
  }

  private getValues(query: string) {
    const lowerCaseQuery = query.toLowerCase();
    return DIRECTLY_USED_VARIABLES.filter(usedVariable => usedVariable.toLowerCase().startsWith(lowerCaseQuery)).map(
      usedVariableName => ({
        value: usedVariableName,
        label: usedVariableName,
      }),
    );
  }
  private getItems = (query: string) => {
    return Promise.resolve(this.getValues(query));
  };
  private handleVariableChange = (event: any, item: ComboBoxItem) => {
    if (!this.isUnmounting) {
      this.setState({ selectedVariable: item });
    }
  };
  private handleUnexpectedVariableInput = (query: string) => {
    const values = this.getValues(query);
    if (values.length > 0) {
      return values[0];
    } else {
      return this.resetVariable();
    }
  };
  private resetVariable = () => {
    if (!this.isUnmounting) {
      this.setState({ selectedVariable: undefined });
    }
  };
}

interface ComponentShowcaseProps {
  name: string;
  description: ComponentDescriptionType;
  isDebugMode?: boolean;
  onVariableSelect: (event: any, item: ComboBoxItem) => void;
}
class ComponentShowcase extends React.Component<ComponentShowcaseProps, {}> {
  public render() {
    const { name, description, onVariableSelect, isDebugMode } = this.props;
    const elements = Object.keys(description);

    return (
      <React.Fragment>
        <Sticky side={'top'} offset={parseInt(styles.searchBarHeight, 10)}>
          {isSticky => <h2 className={`${styles.heading} ${isSticky && styles.headingSticky}`}>{this.props.name}</h2>}
        </Sticky>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: 200 }}>ClassName</th>
              <th style={{ width: 220 }}>Variable Name</th>
              <th style={{ width: 250 }}>Default Value</th>
              <th style={{ width: 250 }}>Flat Value</th>
            </tr>
          </thead>
          <tbody>
            {elements.map(el => (
              <ComponentShowcaseRow
                key={`${name}_${el}`}
                element={el}
                row={description[el]}
                onVariableSelect={onVariableSelect}
                isDebugMode={isDebugMode}
              />
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

interface ComponentShowcaseRowProps {
  element: string;
  row: ComponentRowDescriptionType;
  isDebugMode?: boolean;
  onVariableSelect: (event: any, item: ComboBoxItem) => void;
}

class ComponentShowcaseRow extends React.Component<ComponentShowcaseRowProps> {
  public render() {
    const { element: el, row, isDebugMode } = this.props;
    const rowSpan = row.variables.length + 1;

    return (
      <React.Fragment>
        <tr className={styles.invisibleRow}>
          <td rowSpan={rowSpan}>
            <Tooltip
              render={this.getCss}
              pos={'bottom left'}
              allowedPositions={CSS_TOOLTIP_ALLOWED_POSITIONS}
              trigger={'click'}
              useWrapper={false}
            >
              <span className={styles.elementName}>.{el}</span>
            </Tooltip>
          </td>
          <td className={styles.invisibleCell} />
          <td className={styles.invisibleCell} />
          <td className={styles.invisibleCell} />
        </tr>
        {row.variables.map(varName => {
          const variableDefault = (defaultVariables as ITheme)[varName];
          const variableFlat = (flatVariables as ITheme)[varName];
          const hasNoVariables = isDebugMode && !variableDefault && !variableFlat;
          const hasOnlyDefaultVariable = isDebugMode && variableDefault && !variableFlat;

          return (
            <tr key={`${el}_${varName}`} className={hasNoVariables ? styles.suspiciousRow : undefined}>
              <td className={hasOnlyDefaultVariable ? styles.suspiciousCell : undefined}>
                <VariableName variableName={varName as string} onVariableSelect={this.props.onVariableSelect} />
              </td>
              <td>
                <VariableValue value={variableDefault} />
              </td>
              <td>
                <VariableValue value={variableFlat} />
              </td>
            </tr>
          );
        })}
      </React.Fragment>
    );
  }

  private getCss = () => {
    return <span className={styles.relativeCss}>{this.props.row.contents}</span>;
  };
}

interface VariableNameProps {
  variableName: string;
  onVariableSelect: (event: any, item: ComboBoxItem) => void;
}

class VariableName extends React.Component<VariableNameProps> {
  public render() {
    return (
      <span className={styles.variableName} onClick={this.handleVariableSelect}>
        {this.props.variableName}
      </span>
    );
  }
  private handleVariableSelect = () => {
    const { variableName, onVariableSelect } = this.props;
    if (onVariableSelect) {
      onVariableSelect(event, { value: variableName, label: variableName });
    }
  };
}

const VariableValue = (props: { value: string }) => {
  const value = props.value;
  const valueIsColor = isColor(value);
  const valueIsGradient = isGradient(value);
  const hasExample = valueIsColor || valueIsGradient;
  let borderColor = 'transparent';
  if (hasExample) {
    borderColor = valueIsColor ? ColorFunctions.contrast(value) : '#000';
  }

  return (
    <span className={!value ? styles.undefined : undefined}>
      {hasExample && <span className={styles.colorExample} style={{ background: value, borderColor }} />}
      {value || 'undefined'}
    </span>
  );
};

const ShowUnusedVariables = (props: { diff: string[] }) => {
  if (props.diff.length === 0) {
    return null;
  }

  return (
    <div className={styles.unusedVariablesWarning}>
      Неиспользованные переменные ({props.diff.length}
      ):
      <ul>
        {props.diff.sort().map(v => (
          <li key={v}>{v}</li>
        ))}
      </ul>
    </div>
  );
};

function isColor(input: string) {
  return !!input && (input.startsWith('#') || input.startsWith('rgb') || input.startsWith('hsl'));
}

function isGradient(input: string) {
  return !!input && input.startsWith('linear-gradient');
}
