/**
 Class where instead of adding to list box clicking removes from it
 **/
import {ListBox} from "./ListBox";

class InverseListBox extends ListBox {
    onSelect(val) {
        // for now don't really care about duplicates
        const newVals = [...this.state.selectedVals, val];
        console.log(newVals);
        this.props.onClick(newVals);
        this.setState({selectedVals: newVals});
    }

    onDeselect(val) {
        if (!this.state.selectedVals.includes(val))
            console.warn("Value to be deselected inside ListBox is somehow not contained in the ListBox!");

        const newVals = this.state.selectedVals.filter((selectedVal) => selectedVal !== val);
        this.props.onClick(newVals);
        this.setState({selectedVals: newVals});
    }
}
