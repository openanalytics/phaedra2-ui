import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/calculation-service';

export default {
    async getFormula(id) {
        const response = await axios.get(apiURL + '/formulas/' + id);
        return response.data;
    },
    async getFormulaInputs(id) {
        const response = await axios.get(apiURL + '/formulas/' + id + '/inputs');
        return response.data;
    },
    async getAllFormulas() {
        const response = await axios.get(apiURL + '/formulas');
        return response.data;
    },
    async createFormula(formula) {
        const response = await axios.post(apiURL + '/formulas', removeReadOnlyFields(formula));
        return response.data;
    },
    async updateFormula(id, updatedFormula) {
        const response = await axios.put(apiURL + '/formulas/' + id, removeReadOnlyFields(updatedFormula));
        return response.data;
    },
    async deleteFormula(id) {
        await axios.delete(apiURL + '/formulas/' + id);
    },
    async startCalculation(calcRequest) {
        const response = await axios.post(apiURL + '/calculation', calcRequest);
        return response.data;
    }
}

function removeReadOnlyFields(formula) {
    if (formula) {
        delete formula.id;
        delete formula.createdOn;
        delete formula.createdBy;
        delete formula.updatedOn;
        delete formula.updatedBy;
    }
    return formula;
}